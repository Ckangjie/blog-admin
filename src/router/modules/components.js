import Layout from '@/layout'

const componentsRouter = [
    {
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
        }, {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/menu'),
            meta: { title: '菜单管理', icon: 'el-icon-message' }
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
                path: '/details/:id',
                name: 'details',
                component: () => import('@/views/article/details'),
                meta: { title: '文章详情', icon: 'table' },
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
]

export default componentsRouter
