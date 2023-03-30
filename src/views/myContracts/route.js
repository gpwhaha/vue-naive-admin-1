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
      component: () => import('./my-create.vue'),
      meta: {
        title: '我创建的',
        icon: 'mdi:create',
        keepAlive: false,
      },
    },
    {
      name: 'myCharge',
      path: 'myCharge',
      component: () => import('./my-charge.vue'),
      meta: {
        title: '我负责的',
        icon: 'mdi:book-open',
        keepAlive: false,
      },
    },
    {
      name: 'myJoin',
      path: 'myJoin',
      component: () => import('./my-join.vue'),
      meta: {
        title: '我参加的',
        icon: 'mdi:book-open',
        keepAlive: false,
      },
    },
    {
      name: 'myConsultation',
      path: 'myConsultation',
      component: () => import('./my-consultation.vue'),
      meta: {
        title: '我的协商',
        icon: 'mdi:book-open',
        keepAlive: false,
      },
    },
  ],
}
