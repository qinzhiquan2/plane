import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: { title: '登录' },
      component: Login
    },
    {  
      path: '/',  
      redirect: '/login' // 将根路径重定向到登录页面  
      // 或者，如果您想在这里做一些检查（比如用户是否已登录），可以使用 beforeEnter 守卫  
      // beforeEnter: (to, from, next) => {  
      //   // 检查用户是否已登录，如果未登录则重定向到登录页面  
      //   // 如果已登录，则可能重定向到另一个页面，比如首页或仪表盘  
      //   next('/login'); // 假设这里总是重定向到登录页面  
      // }  
    },
   
    {
      path: '/home',
      name: 'Home',
      meta: { title: '导航' },
      component: () => import('../views/Home.vue')
    },
    {
      path: '/drlist',
      name: 'DrList',
      meta: { title: '缺陷报告' },
      component: () => import('../views/DrList.vue')
    },
    {
      path: '/drform',
      name: 'Drform',
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
