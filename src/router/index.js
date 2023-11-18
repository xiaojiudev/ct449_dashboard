import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/auth/Login.vue'
import Logout from "../views/auth/Logout.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/products/:id',
      name: 'edit',
      component: () => import('../views/EditProductsView.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
      meta: {}
    },
    {
      path: '/logout',
      component: Logout,
      name: 'logout',
      meta: {requiresAuth: true,},
    },
  ]
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(route => route.meta.requiresAuth)) {

    const token = getCookie('token'); 

    if (!token) {

      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
})


export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

export default router
