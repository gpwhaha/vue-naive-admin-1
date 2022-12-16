const Layout = () => import('@/layout/index.vue')

export default {
  name: 'contract-drafting',
  path: '/contract-drafting',
  component: Layout,
  redirect: '/contract-drafting/Intelligent-Review',
  meta: {
    title: '合同起草',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 2,
  },
  children: [
    {
      name: 'IntelligentReview',
      path: 'Intelligent-Review',
      component: () => import('./Intelligent-Review/index.vue'),
      meta: {
        title: '智能审查',
        icon: 'ic:baseline-table-view',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
  ],
}
