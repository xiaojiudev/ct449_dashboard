<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Orders</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-spin :spinning="isSubmitting">
            <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 8 }" rowKey="id" bordered>
                <template #headerCell="{ column }">
                    <template v-if="column.key === 'customer'">
                        <span style="color: #1890ff">Customer</span>
                    </template>
                    <template v-if="column.key === 'status'">
                        <span style="color: #1890ff">Status</span>
                    </template>
                </template>
                <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
                    <div style="padding: 8px">
                        <a-input ref="searchInput" :placeholder="`Search ${column.dataIndex}`" :value="selectedKeys[0]"
                            style="width: 188px; margin-bottom: 8px; display: block"
                            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
                        <a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
                            @click="handleSearch(selectedKeys, confirm, column.dataIndex)">
                            <template #icon>
                                <SearchOutlined />
                            </template>
                            Search
                        </a-button>
                        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
                            Reset
                        </a-button>
                    </div>
                </template>
                <template #customFilterIcon="{ filtered }">
                    <SearchOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
                </template>
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
                                {{ console.log("All invoice is: ", record.invoice) }}
                                <div v-for="(item, index) in record.invoice" :key="index">
                                    <div style="width: 400px;">
                                        <a-row :gutter="[16, 16]" style="margin-top: 18px;" justify="center" align="middle">
                                            <a-col :span="3">
                                                <a-avatar :src="item.image" />
                                            </a-col>
                                            <a-col :span="9">{{ item.name }}</a-col>
                                            <a-col :span="4">x{{ item.quantity }}</a-col>
                                            <a-col :span="4">${{ (item.price).toFixed(2) }}</a-col>
                                            <a-col :span="4">${{ (item.price * item.quantity).toFixed(2) }}</a-col>
                                        </a-row>
                                    </div>
                                </div>
                            </template>
                            <a style="user-select: none;">Details</a>
                        </a-popover>
                        <!-- <div>{{ record }}</div> -->
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <a-tag :key="text"
                            :color="text === 'pending' ? 'purple' : text === 'failed' ? 'error' : text === 'paid' ? 'success' : text === 'delivered' ? 'processing' : 'warning'">
                            {{ text.toUpperCase() }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                            <a-button @click="setOrderStatus(record, 'canceled')"
                                :disabled="record.status === 'paid' ? true : record.status === 'delivered' ? true : record.status === 'canceled' ? true : false">
                                <CloseOutlined style="color: #f9c93e; font-size: 18px;" />
                            </a-button>
                            <a-button @click="setOrderStatus(record, 'delivered')"
                                :disabled="record.status === 'pending' ? false : true" style="margin-left: 12px;">
                                <CheckOutlined style="color: #f93e6e; font-size: 18px;" />
                            </a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { CloseOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons-vue';

const columns = [
    {
        title: 'S.No',
        dataIndex: 'no',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.no - b.no,
    },
    {
        key: 'customer',
        title: 'Customer',
        dataIndex: 'customer',
        customFilterDropdown: true,
        onFilter: (value, record) => {
            // console.log(record.customer.fullname);
            return record.customer.fullname.toString().toLowerCase().includes(value.toLowerCase())
        },
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
    },
    {
        title: 'Order ID',
        dataIndex: 'order_id',
    },
    {
        title: 'Order Date',
        dataIndex: 'order_date',
        sorter: (a, b) => {
            const dateA = new Date(a.order_date.replace(" at", "")).getTime();
            const dateB = new Date(b.order_date.replace(" at", "")).getTime();

            return dateA - dateB;
        },
    },
    {
        title: 'Order Amount',
        dataIndex: 'order_amount',
        sorter: (a, b) => a.order_amount - b.order_amount,
    },
    {
        title: 'Payment Method',
        dataIndex: 'payment_method',
        filters: [
            { text: 'COD', value: 'COD' },
            { text: 'Visa', value: 'Visa' },
            { text: 'Debit', value: 'Debit' },
            { text: 'Stripe', value: 'Stripe' },
        ],
        onFilter: (value, record) => record.payment_method.indexOf(value) === 0,
    },
    {
        title: 'Invoice',
        dataIndex: 'invoice',
    },
    {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        filters: [
            { text: 'pending', value: 'pending' },
            { text: 'canceled', value: 'canceled' },
            { text: 'delivered', value: 'delivered' },
            { text: 'paid', value: 'paid' },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
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

const state = reactive({
    searchText: '',
    searchedColumn: '',
});

const searchInput = ref();

const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    state.searchText = selectedKeys[0];
    state.searchedColumn = dataIndex;
};

const handleReset = clearFilters => {
    clearFilters({ confirm: true });
    state.searchText = '';
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

        console.log(data.value);


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