<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Products</a-breadcrumb-item>
        <a-breadcrumb-item>All Products</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '16px', background: '#fff', minHeight: '360px' }">
        <a-button type="primary" size="large" style="float: right; margin-bottom: 16px;" @click="editProduct(null)">
            Add product
        </a-button>
        <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 8 }" rowKey="id" bordered>
            <template #headerCell="{ column }">
                <template v-if="column.key === 'name'">
                    <span style="color: #1890ff">Name</span>
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
            <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'description'">
                    <a-tooltip :overlay-inner-style="{ maxHeight: '50vh', 'overflow-y': 'scroll' }">
                        <template #title>
                            <span v-html="text" class="tooltip-custom"></span>
                        </template>
                        <p v-html="text"
                            style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                        </p>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'image'">
                    <img :src="text" alt="" style="object-fit: cover; width: 100%; height: 80px; border-radius: 3px;">
                </template>
                <template v-if="column.dataIndex === 'category'">
                    <a-tag :key="text" :color="text === 'flower' ? 'green' : text.length > 5 ? 'geekblue' : 'volcano'">
                        {{ text.toUpperCase() }}
                    </a-tag>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <a @click="editProduct(text ?? null)">
                            <EditOutlined style="color: #f9c93e; font-size: 18px;" />
                        </a>
                        <a-popconfirm title="Sure to delete?" @confirm="deleteProduct(text)">
                            <a>
                                <DeleteOutlined style="color: #f93e6e; font-size: 18px;" />
                            </a>
                        </a-popconfirm>
                    </div>
                </template>

            </template>
        </a-table>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue';


const columns = [
    {
        title: 'S.No',
        dataIndex: 'id',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.id - b.id,
        width: 70,
    },
    {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        customFilterDropdown: true,
        onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
    },
    {
        title: 'Image',
        dataIndex: 'image',
        bodyCell: { customRender: "image" },
    },
    {
        title: 'Price',
        dataIndex: 'price',
        sorter: (a, b) => a.price - b.price,
    },
    {
        key: 'quantity',
        title: 'Quantity',
        dataIndex: 'quantity',
        // defaultSortOrder: 'descend',
        sorter: (a, b) => a.quantity - b.quantity,
        filters: [
            { text: '0', value: '0' },
        ],
        onFilter: (value, record) => record.quantity === parseInt(value),
    },
    {
        title: 'Description',
        dataIndex: 'description',
        ellipsis: true,
    },
    {
        title: 'Category',
        dataIndex: 'category',
        filters: [
            { text: 'flower', value: 'flower' },
            { text: 'bag', value: 'bag' },
        ],
        onFilter: (value, record) => record.category.indexOf(value) === 0,
    },
    {
        title: 'Action',
        dataIndex: 'action',
        bodyCell: { customRender: 'action' },
    },
];

const data = ref([]);

const router = useRouter();

const fetchProducts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/products');

        data.value = response.data.product.map((product, i) => ({
            key: i,
            id: i + 1,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.quantityInStock,
            description: product.description,
            category: product.category,
            action: product.id,
        }));



    } catch (error) {
        console.error('Error fetching products:', error);
    }
};
const editProduct = (productId) => {
    console.log('Edit product:', productId);
    router.push(`/products/${productId}`);
};

const deleteProduct = async (productId) => {
    try {

        const response = await axios.delete(`http://localhost:8080/api/v1/products/${productId}`, {
            withCredentials: true,
        });

        if (response.status === 200) {
            message.success(`Product ${productId} deleted successfully`, 2);
            await fetchProducts();
        }

    } catch (error) {
        console.error('Error deleting product:', error);
        message.success('Error when deleting product', error);
    }
};

onMounted(() => {
    fetchProducts();
});

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
</script>
  
<style >
.tooltip-custom>p>* {
    color: #fff !important;
}
</style>