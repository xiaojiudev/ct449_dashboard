<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { HomeOutlined, UserOutlined, ShopOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons-vue';

import Logout from '../views/auth/Logout.vue';
</script>

<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <a style="display: flex; justify-content: center; padding: 10px;" href="/">
                <img src="../assets/d.png" alt="Dandelion" width="32" height="32" style="object-fit: cover;">
            </a>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-menu-item key="1">
                    <HomeOutlined />
                    <span>
                        <RouterLink to="/">Home</RouterLink>
                    </span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>User</span>
                        </span>
                    </template>
                </a-sub-menu>
                <a-sub-menu key="sub2">
                    <template #title>
                        <span>
                            <ShopOutlined />
                            <span>Products</span>
                        </span>
                    </template>
                    <a-menu-item key="6">
                        <RouterLink to="/products">All products</RouterLink>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item key="2">
                    <ShoppingCartOutlined />
                    <span>
                        <RouterLink to="/orders">Orders</RouterLink>
                    </span>
                </a-menu-item>
                <a-menu-item key="9">
                    <LogoutOutlined />
                    <span>
                        <Logout />
                    </span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0" />
            <a-layout-content style="margin: 0 16px">
                <RouterView />
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script>
import { ref } from 'vue';
const collapsed = ref(false);
const selectedKeys = ref(['1']);

</script>
<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>
