/** 重置样式 */
import '@/styles/reset.css'
import 'uno.css'
import '@/styles/global.scss'
import 'virtual:svg-icons-register'

// import echarts from '@/plugin/echarts'

import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import App from './App.vue'

async function setupApp() {
  const app = createApp(App)

  // app.config.globalProperties.$echarts = echarts

  setupStore(app)

  await setupRouter(app)

  app.mount('#app')
}

setupApp()
