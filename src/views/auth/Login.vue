<template>
    <a-form :model="formState" name="login" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="Email" name="email"
            :rules="[{ required: true, type: 'email', message: 'Please input your email!' }]">
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
import { message } from 'ant-design-vue';


interface FormState {
    email: string;
    password: string;
}

const formState = reactive<FormState>({
    email: '',
    password: '',
});

const router = useRouter();

const onFinish = async (values: any) => {
    try {
        const { email, password } = values;

        const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
            email: email,
            password: password,
        }, {
            withCredentials: true,
        });

        const { user, msg } = response.data;

        if (msg === "Login successful!" && user.role == "admin") {

            message.success('Login successfully');
            router.push({ path: '/' })

        } else {
            message.error('Access denied');
        }
    } catch (error) {
        console.error('Login failed:', error);
        message.error('Login failed:');
    }
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Login failed:');
};


</script>
  
  