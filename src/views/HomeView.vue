<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Overview</a-breadcrumb-item>
        <a-breadcrumb-item>Statistic</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#eae9e9', minHeight: '360px' }">
        <a-row :gutter="[16, 16]">
            <a-col :span="12">
                <a-table :columns="productStatColumns" :data-source="productStats" bordered>
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.dataIndex === 'name'">
                            <a>{{ text }}</a>
                        </template>
                    </template>
                    <template #title>
                        <div style="font-weight: 600; text-align: center; font-size: 22px; color: #3f8600">
                            Product Stats
                        </div>
                    </template>
                    <!-- <template #footer>Footer</template> -->
                </a-table>
            </a-col>
            <a-col :span="12">
                <a-row :gutter="[16, 16]">
                    <a-col :span="12">
                        <a-card>
                            <a-statistic title="Total Revenue" :value="totalRevenue" :precision="2" suffix="$"
                                :value-style="{ color: '#3f8600' }" style="margin-right: 50px">
                                <template #prefix>
                                    <arrow-up-outlined />
                                </template>
                            </a-statistic>
                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card>
                            <a-statistic title="Total Orders" :value="totalOrders" :precision="0" suffix="orders"
                                :value-style="{ color: '#3f8600' }" style="margin-right: 50px">
                                <template #prefix>
                                    <arrow-up-outlined />
                                </template>
                            </a-statistic>
                        </a-card>
                    </a-col>
                </a-row>
                <a-divider />
                <a-table :columns="dailyRevenueColumns" :data-source="dailyRevenue" bordered>
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.dataIndex === 'name'">
                            <a>{{ text }}</a>
                        </template>
                    </template>
                    <template #title>
                        <div style="font-weight: 600; text-align: center; font-size: 22px; color: #3f8600">
                            Daily Revenue
                        </div>
                    </template>
                </a-table>
            </a-col>
            <a-col :span="24">
                <a-table :columns="ordersByDayColumns" :data-source="ordersByDay" bordered>
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.dataIndex === 'name'">
                            <a>{{ text }}</a>
                        </template>
                    </template>
                    <template #title>
                        <div style="font-weight: 600; text-align: center; font-size: 22px; color: #3f8600">
                            Order by Day
                        </div>
                    </template>
                </a-table>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';


const productStats = ref([])
const dailyRevenue = ref([]);
const ordersByDay = ref([]);
const totalRevenue = ref(0);
const totalOrders = ref(0);


const productStatColumns = [
    {
        title: 'Product Name',
        dataIndex: 'productName',
    },
    {
        title: 'Total Quantity Sold',
        dataIndex: 'totalQuantitySold',
    },
    {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
    },
    {
        title: 'Total Cost',
        dataIndex: 'totalCost',
    },
];


const dailyRevenueColumns = [
    {
        title: 'Date',
        dataIndex: '_id',
    },
    {
        title: 'Total Revenue',
        dataIndex: 'totalRevenue',
    },
];

const ordersByDayColumns = [
    {
        title: 'Date',
        dataIndex: '_id',
    },
    {
        title: 'Total Orders',
        dataIndex: 'totalOrders',
    },
];






onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/statistic', {
            withCredentials: true,
        });

        productStats.value = response.data.productStats;
        dailyRevenue.value = response.data.dailyRevenue;
        ordersByDay.value = response.data.ordersByDay;

        totalRevenue.value = calculateTotalValue(dailyRevenue.value, 'totalRevenue');

        totalOrders.value = calculateTotalValue(ordersByDay.value, 'totalOrders');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

const calculateTotalValue = (data, field) => {
    return data.reduce((total, item) => total + item[field], 0);
};



</script>


