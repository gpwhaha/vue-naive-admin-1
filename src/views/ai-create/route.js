const Layout = () => import('@/layout/index.vue')

export default {
  name: 'ai-create',
  path: '/ai-create',
  component: Layout,
  redirect: '/ai-create/create-onlie',
  meta: {
    title: '智能起草',
    icon: 'ion:ios-paper-plane',
    role: ['admin'],
    requireAuth: true,
    order: 2,
  },
  children: [
    {
      name: 'create-onlie',
      path: 'create-onlie',
      component: () => import('./create-online.vue'),
      meta: {
        title: '在线起草',
        icon: 'ion:ios-create',
        order: 0,
        keepAlive: true,
      },
    },
    {
      name: 'IntelligentReview',
      path: 'Intelligent-Review',
      component: () => import('./Intelligent-Review.vue'),
      meta: {
        title: '智能审查',
        icon: 'ion:ios-checkbox',
        role: ['admin'],
        order: 1,
        requireAuth: true,
        keepAlive: true,
      },
    },
    {
      name: 'editContract',
      path: 'edit-Contract',
      component: () => import('./edit-Contract.vue'),
      isHidden: true,
      meta: {
        title: '编辑合同',
        icon: 'ion:ios-checkbox',
        order: 1,
        keepAlive: false,
      },
    },
  ],
}
