const Layout = () => import('@/layout/index.vue')

export default {
  name: 'workbench',
  path: '/',
  component: Layout,
  redirect: '/workbench',
  children: [
    {
      name: 'workbench',
      path: 'workbench',
      component: () => import('./index.vue'),
      meta: {
        title: '工作台',
        icon: 'mdi:home',
        order: 0,
        keepAlive: true,
      },
    },
  ],
}
