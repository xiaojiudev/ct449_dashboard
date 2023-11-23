<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Products</a-breadcrumb-item>
        <a-breadcrumb-item>{{ productId == "null" ? "Add product": "Edit product" }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <!-- Content -->
        <a-spin :spinning="isSubmitting">
            <a-form :model="formState" v-bind="layout" name="edit-product" :validate-messages="validateMessages"
                @finish="onFinish">
                <a-form-item name="name" label="Name" :rules="[{ required: true }]">
                    <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item name="price" label="Price" :rules="[{ required: true, type: 'number', min: 0.00 }]">
                    <a-input-number v-model:value="formState.price" />
                </a-form-item>
                <a-form-item name="quantity" label="Quantity"
                    :rules="[{ required: true, type: 'number', min: 0, max: 99999 }]">
                    <a-input-number v-model:value="formState.quantity" />
                </a-form-item>
                <a-form-item label="Image" name="image" :rules="[{ required: imageUrl ? false : true }]">
                    <a-upload v-model:fileList="formState.image" :max-count="1" :before-upload="beforeUpload"
                        list-type="picture-card">
                        <img v-if="imageUrl" :src="imageUrl" alt="avatar" width="84" height="84"
                            style="object-fit: cover;" />
                        <div v-else>
                            <PlusOutlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>
                <a-form-item label="Category" name="category" :rules="[{ required: true }]">
                    <a-select v-model:value="formState.category" placeholder="please select your category">
                        <a-select-option value="flower">Flower</a-select-option>
                        <a-select-option value="bag">Hand bag</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item name="description" label="Description" :rules="[{ required: true }]">
                    <!-- <a-textarea v-model:value="formState.description" /> -->
                    <QuillEditor theme="snow" toolbar="full" v-model:content="formState.description" content-type="html" style="min-height: 200px;"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
                    <a-button type="primary" html-type="submit" :disabled="isSubmitting">Submit</a-button>
                </a-form-item>
            </a-form>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const router = useRouter();
const route = useRoute();
const productId = route.params.id;


const formState = reactive({
    name: '',
    price: undefined,
    quantity: undefined,
    description: '',
    image: undefined,
    category: undefined,
});

const imageUrl = ref<string>('');


const fileList = ref<UploadProps['fileList']>([]);

const beforeUpload: UploadProps['beforeUpload'] = file => {
    fileList.value = [...(fileList.value || []), file];
    imageUrl.value = '';
    return false;
};

const isSubmitting = ref<boolean>(false);

const onFinish = async (values: any) => {
    console.log('Success:', values);

    try {

        const { name, price, description, image, category, quantity } = values;



        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);

        if (image) {
            const file = image[0].originFileObj;
            formData.append('image', file);
        }

        formData.append('category', category);
        formData.append('quantityInStock', quantity);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        };

        isSubmitting.value = true;

        let response;

        if (productId == 'null') {
            response = await axios.post('http://localhost:8080/api/v1/products', formData, config);
        } else {
            response = await axios.patch(`http://localhost:8080/api/v1/products/${productId}`, formData, config);
        }

        console.log(response);
        if (response.status == 201) {
            message.success("Created product successfully");
            router.push({ name: 'products' });
        } else if (response.status == 200) {
            message.success("Updated product successfully");
            router.push({ name: 'products' });
        } else {
            message.error("Something went wrong");
        }


    } catch (error) {
        message.error("Something went wrong" + error)
    }
    finally {

        isSubmitting.value = false;
    }

};


const fetchProductDetails = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/products/${productId}`);
        const productDetails = response.data.product;

        formState.name = productDetails.name || "";
        formState.price = productDetails.price || undefined;
        formState.description = productDetails.description || '';
        formState.category = productDetails.category || undefined;
        formState.quantity = productDetails.quantityInStock || undefined;
        imageUrl.value = productDetails.image;
        console.log(formState.image);



    } catch (error) {
        console.error('Error fetching product details:', error);
        message.error("Error fetching product details:" + error)
    }
};

onMounted(async () => {
    if (productId !== 'null') {
        await fetchProductDetails();
    }
});



</script>
  
  