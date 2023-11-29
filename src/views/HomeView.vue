<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Overview</a-breadcrumb-item>
        <a-breadcrumb-item>Statistic</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#e1e4e7', minHeight: '360px' }">
        <a-spin :spinning="isLoading">
            <a-row :gutter="[16, 16]">
                <a-col :span="14">
                    <a-table :columns="productStatColumns" :data-source="productStats" bordered>
                        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
                            <div style="padding: 8px">
                                <a-input ref="searchInput" :placeholder="`Search ${column.dataIndex}`"
                                    :value="selectedKeys[0]" style="width: 188px; margin-bottom: 8px; display: block"
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
                        <template #bodyCell="{ column, text }">
                            <template v-if="column.dataIndex === 'name'">
                                <a>{{ text }}</a>
                            </template>
                        </template>
                        <template #title>
                            <div style="font-weight: 600; text-align: center; font-size: 22px; color: #4fa4e9">
                                Product Stats
                            </div>
                        </template>
                        <!-- <template #footer>Footer</template> -->
                    </a-table>
                </a-col>
                <a-col :span="10">
                    <a-row :gutter="[16, 16]">
                        <a-col :span="12">
                            <a-card>
                                <a-statistic title="Total Revenue" :value="totalRevenue" :precision="2" suffix="$"
                                    :value-style="{ color: '#3f8600' }" style="margin-right: 30px">
                                    <template #prefix>
                                        <arrow-up-outlined />
                                    </template>
                                </a-statistic>
                            </a-card>
                        </a-col>
                        <a-col :span="12">
                            <a-card>
                                <a-statistic title="Total Orders" :value="totalOrders" :precision="0" suffix="orders"
                                    :value-style="{ color: '#3f8600' }" style="margin-right: 30px">
                                    <template #prefix>
                                        <PlusOutlined />
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
                            <div style="font-weight: 600; text-align: center; font-size: 22px; color: #4fa4e9">
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
                            <div style="font-weight: 600; text-align: center; font-size: 22px; color: #4fa4e9">
                                Order by Day
                            </div>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { SearchOutlined, ArrowUpOutlined, PlusOutlined } from '@ant-design/icons-vue';


const isLoading = ref(false);
const productStats = ref([])
const dailyRevenue = ref([]);
const ordersByDay = ref([]);
const totalRevenue = ref(0);
const totalOrders = ref(0);


const productStatColumns = [
    {
        title: 'Product Name',
        dataIndex: 'productName',
        customFilterDropdown: true,
        onFilter: (value, record) => record.productName.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
    },
    {
        title: 'Total Quantity Sold',
        dataIndex: 'totalQuantitySold',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.totalQuantitySold - b.totalQuantitySold,
    },
    {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
    },
    {
        title: 'Total Cost',
        dataIndex: 'totalCost',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.totalCost - b.totalCost,
    },
];


const dailyRevenueColumns = [
    {
        title: 'Date',
        dataIndex: '_id',
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            const dateA = new Date(a._id).getTime();;
            const dateB = new Date(b._id).getTime();;
            return dateA - dateB;
        },
    },
    {
        title: 'Total Revenue (Paid)',
        dataIndex: 'totalRevenue',
        sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    },
];

const ordersByDayColumns = [
    {
        title: 'Date',
        dataIndex: '_id',
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            const dateA = new Date(a._id).getTime();;
            const dateB = new Date(b._id).getTime();;
            return dateA - dateB;
        },
    },
    {
        title: 'Total Orders',
        dataIndex: 'totalOrders',
        sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
];

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



onMounted(async () => {
    try {
        isLoading.value = true;
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
    } finally {
        isLoading.value = false;
    }
});

const calculateTotalValue = (data, field) => {
    return data.reduce((total, item) => total + item[field], 0);
};



</script>


