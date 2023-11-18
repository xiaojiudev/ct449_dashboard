<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Products</a-breadcrumb-item>
        <a-breadcrumb-item>All Products</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-button type="primary" style="margin-bottom: 16px" @click="editProduct(null)">
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
                <template v-if="column.dataIndex === 'edit'">
                    <a @click="editProduct(text ?? null)">Edit</a>
                </template>
                <template v-else-if="column.dataIndex === 'delete'">
                    <a @click="deleteProduct(text)">Delete</a>
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


const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        width: 100,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 150,
    },
    {
        title: 'Image',
        dataIndex: 'image',
        bodyCell: { customRender: "image" },
        width: 120,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        width: 150,
    },
    {
        title: 'Quantity ',
        dataIndex: 'quantity',
    },
    {
        title: 'Category',
        dataIndex: 'category',
    },
    {
        title: 'Edit',
        dataIndex: 'edit',
        bodyCell: { customRender: 'edit' },
    },
    {
        title: 'Delete',
        dataIndex: 'delete',
        bodyCell: { customRender: 'delete' },
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
            category: product.category,
            edit: product.id,
            delete: product.id,

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
  
  