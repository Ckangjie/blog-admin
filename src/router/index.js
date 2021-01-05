import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-message' }
    }]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },
]

// 异步路由
export const asyncRoutes = [{
  path: '/system',
  component: Layout,
  redirect: '/user',
  name: 'system',
  meta: { title: '系统管理', icon: 'el-icon-s-help', roles: ['admin'] },
  children: [{
    path: 'user',
    name: 'user',
    component: () => import('@/views/system/user'),
    meta: { title: '用户管理', icon: 'el-icon-message' }
  }, {
    path: 'role',
    name: 'role',
    component: () => import('@/views/system/role'),
    meta: { title: '角色管理', icon: 'el-icon-message' }
  },]
},
{
  path: '/example',
  component: Layout,
  redirect: '/article',
  name: 'Example',
  meta: { title: '文章管理', icon: 'el-icon-s-help', roles: ['admin', 'editor'] },
  children: [
    {
      path: '/article',
      name: 'article',
      component: () => import('@/views/article/index'),
      meta: { title: '文章列表', icon: 'table' }
    },
    {
      path: '/comment',
      name: 'comment',
      component: () => import('@/views/article/comment'),
      meta: { title: '评论管理', icon: 'table' }
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('@/views/article/category'),
      meta: { title: '分类管理', icon: 'table' }
    },
    {
      path: '/details/:id',
      name: 'details',
      component: () => import('@/views/article/details'),
      meta: { title: '文章详情', icon: 'table' },
      hidden: true
    },
    {
      path: '/addArticle',
      name: 'details',
      component: () => import('@/components/addArticle'),
      meta: { title: '添加文章', icon: 'table' },
      hidden: true
    },
    {
      path: 'tree',
      name: 'Tree',
      component: () => import('@/views/tree/index'),
      meta: { title: '多级菜单', icon: 'tree' }
    }
  ]
},
// 404 page must be placed at the end !!!
{ path: '*', redirect: '/404', hidden: true }]



const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
