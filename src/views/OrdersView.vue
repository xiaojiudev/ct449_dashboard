<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Orders</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 8 }" rowKey="id" bordered>
            <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'status'">
                    <a-tag :key="text" :color="text === 'pending' ? 'volcano' : 'green'">
                        {{ text.toUpperCase() }}
                    </a-tag>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <a @click="setOrderStatus(false)">
                            <CloseOutlined style="color: #f9c93e; font-size: 18px;" />
                        </a>
                        <a @click="setOrderStatus(true)">
                            <CheckOutlined style="color: #f93e6e; font-size: 18px;" />
                        </a>
                    </div>
                </template>

            </template>
        </a-table>
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
        title: 'Id',
        dataIndex: 'id',
        width: 50,
    },
    {
        title: 'Username',
        dataIndex: 'Username',
    },
    {
        title: 'Product List',
        dataIndex: 'product_list',
        width: 100,
    },
    {
        title: 'Subtotal ',
        dataIndex: 'subtotal',
    },
    {
        title: 'Total',
        dataIndex: 'total',
    },
    {
        title: 'Shipping Fee',
        dataIndex: 'shipping_fee',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Payment Method',
        dataIndex: 'payment_method',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        bodyCell: { customRender: 'action' },
    },
];

const data = ref([]);

const setOrderStatus = (status) => {
    console.log('Set order status:', status);
    
};

</script>