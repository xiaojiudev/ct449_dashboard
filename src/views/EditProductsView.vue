<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Products</a-breadcrumb-item>
        <a-breadcrumb-item>Edit product</a-breadcrumb-item>
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
                <a-form-item name="description" label="Description" :rules="[{ required: true }]">
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>
                <a-form-item label="Image" name="image" :rules="[{ required: true }]">
                    <a-upload v-model:fileList="formState.image" :max-count="1" :before-upload="beforeUpload"
                        list-type="picture-card">
                        <div>
                            <PlusOutlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>
                <a-form-item label="Category" name="category" :rules="[{ required: true }]">
                    <a-select v-model:value="formState.category" placeholder="please select your zone">
                        <a-select-option value="flower">Flower</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
                    <a-button type="primary" html-type="submit" :disabled="isSubmitting">Submit</a-button>
                </a-form-item>
            </a-form>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import axios from 'axios';
import { ref } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
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

const formState = reactive({
    name: '',
    price: undefined,
    quantity: undefined,
    description: '',
    image: undefined,
    category: undefined,
});

const fileList = ref<UploadProps['fileList']>([]);

const beforeUpload: UploadProps['beforeUpload'] = file => {
    fileList.value = [...(fileList.value || []), file];
    return false;
};

const isSubmitting = ref<boolean>(false);

const onFinish = async (values: any) => {
    console.log('Success:', values);

    try {

        const { name, price, description, image, category, quantity } = values;

        const file = image[0].originFileObj;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('image', file);
        formData.append('category', category);
        formData.append('quantityInStock', quantity);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        };

        isSubmitting.value = true;

        const response = await axios.post('http://localhost:8080/api/v1/products', formData, config);

        console.log(response);
        if (response.status == 201) {
            message.success("Created product successfully");
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
</script>
  
  