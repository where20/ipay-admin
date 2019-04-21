import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import { getRole } from '@/utils/auth' // 验权
let isAdmin = getRole() == 0? false:true;
console.log('getRole', getRole(), isAdmin);
/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'home', noCache: true }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: '图标', icon: 'icon', noCache: true }
      }
    ]
  },
  // 交易管理
  {
    path: '/tarde',
    component: Layout,
    redirect: '/trade/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/trade/index'),
        name: 'Trade',
        meta: { title: '交易详情', icon: 'trade', noCache: true }
      }
    ]
  },
  // 商户管理
  {
    path: '/merch',
    component: Layout,
    redirect: '/trade/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/merch/index'),
        name: 'Merch',
        meta: { title: '商户详情', icon: 'merch', noCache: true }
      }
    ]
  },
  // 账号管理
  {
    path: '/account',
    isAdmin: false,
    component: Layout,
    redirect: '/account/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/index'),
        name: 'Account',
        meta: { title: '账号详情', icon: 'account', noCache: true }
      }
    ]
  },
  // 用户管理
  {
    path: '/user',
    isAdmin: false,
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: { title: '用户详情', icon: 'user', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
