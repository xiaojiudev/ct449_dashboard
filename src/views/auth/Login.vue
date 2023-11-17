<template>
    <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please input your email!' }]">
            <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
            <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface FormState {
    email: string;
    password: string;
    remember: boolean;
}

const formState = reactive<FormState>({
    email: '',
    password: '',
    remember: true,
});

const router = useRouter(); 

const onFinish = async (values: any) => {
    try {
        const { email, password } = values;

        const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
            email,
            password,
        }, {
            withCredentials: true,
        });

        const { user, msg } = response.data;

        if (msg === "Login successful!") {
            console.log('User:', user);

            router.push({ path: '/' })
        } else {
            console.error('Login failed:', msg);

        }
    } catch (error) {
        console.error('Login failed:', error);

    }
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
</script>
  
  