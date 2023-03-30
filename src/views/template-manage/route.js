const Layout = () => import('@/layout/index.vue')

export default {
  name: 'templateManagement',
  path: '/templateManagement',
  component: Layout,
  redirect: '/templateManagement/template',
  meta: {
    title: '模板管理',
    icon: 'mdi:application',
    role: ['admin'],
    requireAuth: true,
    order: 1,
  },
  children: [
    {
      name: 'template',
      path: 'template',
      component: () => import('./template.vue'),
      meta: {
        title: '合同模板',
        icon: 'mdi:book-open',
        order: 0,
        keepAlive: true,
      },
    },
    {
      name: 'previewFile',
      path: 'previewFile',
      component: () => import('./file-preview.vue'),
      isHidden: true,
      meta: {
        title: '合同预览',
        icon: 'mdi:book-open',
        order: 0,
        keepAlive: true,
      },
    },
  ],
}
