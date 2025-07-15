import { createWebHistory, createRouter } from 'vue-router'

// 导入pinia仓库 --- 判断是否有用户Token
import { useUserStore } from '@/stores/index'
// const userStore = useUserStore()

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/LayoutContainer.vue'), // 首页架子
    children: [
      { path: '/article/manage', component: () => import ('@/views/article/ArticleManage.vue') }, // 文章管理
      { path: '/article/category', component: () => import ('@/views/article/ArticleCategory.vue') }, // 文章分类
      { path: '/user/avatar', component: () => import ('@/views/user/UserAvatar.vue') }, // 用户修改头像
      { path: '/user/profile', component: () => import ('@/views/user/UserProfile.vue') }, // 用户基本资料
      { path: '/user/password', component: () => import ('@/views/user/UserPassword.vue') } // 用户修改密码
    ],
    redirect: '/article/category'
  }, // 首页架子
  { name: 'Login', path: '/login', component: () => import ('@/views/login/LoginPage.vue') } // 登录页
]

// createRouter创建实例
// history模式：createWebHistory()创建 --- 没有#
// hash模式：createWebHasgHistory()创建 --- 地址栏带#
const router = createRouter({
// import.meta.env.BASE_URL 是vite中的环境变量 --- 指代着 vite.config.js 中的 base 的配置项，一般会配置一些基地址
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  // 当没有查询到用户token时
  if (!userStore.token && to.path !== '/login') {
    // 就拦截到登录页
    return '/login'
  }
})

export default router