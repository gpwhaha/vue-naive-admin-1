const Layout = () => import('@/layout/index.vue')

export default {
  name: 'myContract',
  path: '/myContract',
  component: Layout,
  redirect: '/myContract/myCreate',
  meta: {
    title: '我的合同',
    icon: 'mdi:contract',
    role: ['admin'],
    requireAuth: true,
    order: 3,
  },
  children: [
    {
      name: 'myCreate',
      path: 'myCreate',
      component: () => import('./myCreate.vue'),
      meta: {
        title: '我创建的',
        icon: 'mdi:create',
        keepAlive: false,
      },
    },
    {
      name: 'myCharge',
      path: 'myCharge',
      component: () => import('./myCharge.vue'),
      meta: {
        title: '我负责的',
        icon: 'mdi:book-open',
        keepAlive: false,
      },
    },
    {
      name: 'myJoin',
      path: 'myJoin',
      component: () => import('./myJoin.vue'),
      meta: {
        title: '我参加的',
        icon: 'mdi:book-open',
        keepAlive: false,
      },
    },
    {
      name: 'myConsultation',
      path: 'myConsultation',
      component: () => import('./myConsultation.vue'),
      meta: {
        title: '我的协商',
        icon: 'mdi:book-open',
        keepAlive: false,
      },
    },
  ],
}
