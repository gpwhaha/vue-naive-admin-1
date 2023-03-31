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
    showSideBar: true,
    order: 3,
  },
  children: [
    {
      name: 'myCreate',
      path: 'myCreate',
      redirect: '/myContract/myCreate/myCreate1',
      meta: {
        title: '我的合同',
        icon: 'mdi:create',
        keepAlive: true,
      },
      children: [
        {
          name: 'myCreate1',
          path: 'myCreate1',
          redirect: '/myContract/myCreate/myCreate1/myCreate2',
          meta: {
            title: '我创建的',
            icon: 'mdi:create',
            keepAlive: true,
          },
          children: [
            {
              name: 'myCreate2',
              path: 'myCreate2',
              component: () => import('./my-create.vue'),
              meta: {
                title: '我创建的',
                icon: 'mdi:create',
                keepAlive: true,
              },
            },
            {
              name: 'myCharge2',
              path: 'myCharge2',
              component: () => import('./my-charge.vue'),
              meta: {
                title: '我负责的',
                icon: 'mdi:book-open',
                keepAlive: false,
              },
            },
          ],
        },
      ],
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
        keepAlive: true,
      },
    },
  ],
}
