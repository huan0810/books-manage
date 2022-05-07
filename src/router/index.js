import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        // :path(.*)表示匹配零个或多个路由
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        // affix: true 表示Dashboard标签始终附着在tags-view上
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  // 控制某些选项只能图书管理员才能访问
  {
    path: '/book',
    name: 'book',
    component: Layout,
    redirect: '/book/create',
    meta: { title: '图书管理', icon: 'documentation', roles: ['admin'] },
    children: [
      {
        path: '/book/create',
        name: 'bookCreate',
        component: () => import('@/views/book/create'),
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'] }
      },
      {
        path: '/book/edit',
        name: 'bookEdit',
        component: () => import('@/views/book/edit'),
        hidden: true,
        meta: {
          title: '编辑图书',
          icon: 'edit',
          roles: ['admin'],
          // /book/edit时图书列表高亮显示
          activeMenu: '/book/list'
        }
      },
      {
        path: '/book/list',
        name: 'bookList',
        component: () => import('@/views/book/list'),
        meta: { title: '图书列表', icon: 'list', roles: ['editor'] }
      }
    ]
  },
  // *表示匹配一切路由，上面的路由都不匹配时，就会匹配*，并重定向到404页面
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
