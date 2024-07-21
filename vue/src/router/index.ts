import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      meta: { title: '登录' },
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      meta: { title: '导航' },
      component: () => import('../views/Home.vue')
    },
    {
      path: '/drlist',
      name: 'drList',
      meta: { title: '缺陷报告' },
      component: () => import('../views/DrList.vue')
    },
    {
      path: '/drform',
      name: 'drform',
      meta: { title: '填写报告' },
      component: () => import('../views/DrForm.vue')
    },
  ]
})

// 在路由切换前设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router
