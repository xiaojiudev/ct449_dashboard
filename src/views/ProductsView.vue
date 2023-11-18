<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Products</a-breadcrumb-item>
        <a-breadcrumb-item>All Products</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-button type="primary" size="large"  style="float: right; margin-bottom: 16px;" @click="editProduct(null)">
            Add product
        </a-button>
        <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 8 }" rowKey="id" bordered>
            <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'image'">
                    <img :src="text" alt="" style="object-fit: cover; width: 100px; height: 100px;">
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
                        <a @click="deleteProduct(text)">
                            <DeleteOutlined style="color: #f93e6e; font-size: 18px;"/>
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
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';


const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        width: 50,
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Image',
        dataIndex: 'image',
        bodyCell: { customRender: "image" },
        width: 100,
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        ellipsis: true,
    },
    {
        title: 'Category',
        dataIndex: 'category',
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
</script>
  
  