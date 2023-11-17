<template>
    <span @click="logout">Logout</span>
</template>

<script>
import axios from 'axios';

export default {
    methods: {
        async logout() {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/auth/logout', { withCredentials: true });

                console.log('Logout successful:', response.data.msg);


                this.$router.push('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    }
};
</script>