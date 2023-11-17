<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Products</a-breadcrumb-item>
        <a-breadcrumb-item>All Products</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 8 }" rowKey="id">
            <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'image'">
                    <img :src="text" alt="" style="object-fit: cover; width: 100px; height: 100px;">
                </template>
                <template v-if="column.dataIndex === 'edit'">
                    <a>Edit</a>
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
const editProduct = (index) => {
    console.log('Edit product:', index);
};

const deleteProduct = async (productId) => {
    try {

        const response = await axios.delete(`http://localhost:8080/api/v1/products/${productId}`, {
            withCredentials: true,
        });

        if (response.status === 200) {
            await fetchProducts();
            console.log('Product deleted:', productId);
        }
        console.log(productId);

    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

onMounted(() => {
    fetchProducts();
});
</script>
  
  