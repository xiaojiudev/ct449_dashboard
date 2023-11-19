<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Orders</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-spin :spinning="isSubmitting">
            <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 8 }" rowKey="id" bordered>
                <template #bodyCell="{ text, record, index, column }">
                    <template v-if="column.dataIndex === 'customer'">
                        <a-tooltip :overlay-inner-style="{ maxHeight: '50vh', 'overflow-y': 'scroll' }">
                        <template #title>
                            <span v-html="text.address"></span>
                        </template>
                        <span v-html="text.fullname"
                            style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                        </span>
                    </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'order_amount'">
                        <span>$</span>
                        <span v-html="text"></span>
                    </template>
                    <template v-if="column.dataIndex === 'payment_method'">
                        <a-tag :key="text" :color="text === 'COD' ? 'cyan' : 'green'">
                            {{ text.toUpperCase() }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'invoice'">
                        <a-popover :v-model:open="visible" title="Order Detail" trigger="click">
                            <template #content>
                                <div v-for="(item, index) in record.invoice" :key="index">
                                    <p>
                                        {{ `ID: ${item.product} - Name: ${item.name} - Quantity: ${item.quantity} - Price:
                                                                                ${item.price}` }}
                                    </p>
                                </div>
                            </template>
                            <a style="user-select: none;">Details</a>
                        </a-popover>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <a-tag :key="text"
                            :color="text === 'pending' ? 'purple' : text === 'failed' ? 'error' : text === 'paid' ? 'success' : text === 'delivered' ? 'processing' : 'warning'">
                            {{ text.toUpperCase() }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                            <a @click="setOrderStatus(record, 'canceled')">
                                <CloseOutlined style="color: #f9c93e; font-size: 18px;" />
                            </a>
                            <a @click="setOrderStatus(record, 'delivered')">
                                <CheckOutlined style="color: #f93e6e; font-size: 18px;" />
                            </a>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';

const columns = [
    {
        title: 'S.No',
        dataIndex: 'no',
    },
    {
        title: 'Customer',
        dataIndex: 'customer',
    },
    {
        title: 'Order ID',
        dataIndex: 'order_id',
    },
    {
        title: 'Order Date',
        dataIndex: 'order_date',
    },
    {
        title: 'Order Amount',
        dataIndex: 'order_amount',
    },
    {
        title: 'Payment Method',
        dataIndex: 'payment_method',
    },
    {
        title: 'Invoice',
        dataIndex: 'invoice',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        bodyCell: { customRender: 'action' },
    },
];

const data = ref([]);
const visible = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const hide = () => {
    visible.value = !visible.value;
};

const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
};

const fetchAllOrders = async () => {
    try {
        const res = await axios.get("http://localhost:8080/api/v1/orders", config);

        console.log(res.data);

        data.value = res.data.orders.map((order, i) => ({
            key: i,
            no: i + 1,
            customer: {
                fullname: order.userFullname,
                address: order.address,
            },
            order_id: order._id,
            order_date: new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            }),
            order_amount: order.total,
            payment_method: order.paymentIntentID,
            invoice: order.orderItems,
            status: order.status,
        }))

        console.log(data);




    } catch (error) {
        message.error("Failed while fetching all orders");
    }
}

const setOrderStatus = async (record, status) => {

    try {
        const orderId = record.order_id;

        const data = {
            status: status,
        }
        const startTime = new Date().getTime(); 
        isSubmitting.value = true;

        const res = await axios.patch(`http://localhost:8080/api/v1/orders/${orderId}/updateStatus`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        const endTime = new Date().getTime(); 
        console.log(`Time taken for ${status}: ${endTime - startTime} ms`);

        if (res.status === 200) {
            message.success(`Set ${res.data.order.status} this order successfully`)
        } else {
            message.error('Failed to update order status');
        }
    } catch (error) {
        message.error('Failed to update order status');
    }
    finally {
        await fetchAllOrders();
        isSubmitting.value = false;
    }
};

onMounted(() => {
    fetchAllOrders();
})

</script>