<template>
  <AppPage :show-footer="true" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <div
      style="transform: translateY(25px)"
      class="m-auto p-15 f-c-c min-w-345 max-w-700 rounded-10 card-shadow bg-white bg-opacity-60"
    >
      <div w-380 hidden md:block px-20 py-35>
        <img src="@/assets/images/login_banner.webp" w-full alt="login_banner" />
      </div>

      <div w-320 flex-col px-20 py-35>
        <h5 f-c-c text-24 font-normal color="#6a6a6a"><icon-custom-logo mr-10 text-50 color-primary />{{ title }}</h5>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.name"
            autofocus
            class="text-16 items-center h-50 pl-10"
            placeholder="admin"
            :maxlength="20"
          />
        </div>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.password"
            class="text-16 items-center h-50 pl-10"
            type="password"
            show-password-on="mousedown"
            placeholder="123456"
            :maxlength="20"
            @keydown.enter="handleLogin"
          />
        </div>

        <div v-if="showGraphicsCode" mt-30>
          <n-input v-model:value="loginInfo.verifyCode" placeholder="请输入验证码">
            <template #suffix>
              <img
                v-if="valiCodeUrl"
                :src="valiCodeUrl"
                style="cursor: pointer; width: 20rem; height: 90%"
                @click="getCode"
              />
            </template>
          </n-input>
        </div>

        <div mt-20>
          <n-checkbox :checked="isRemember" label="记住我" :on-update:checked="(val) => (isRemember = val)" />
        </div>

        <div mt-20>
          <n-button w-full h-50 rounded-5 text-16 type="primary" :loading="loading" @click="handleLogin">
            登录
          </n-button>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script setup>
import md5 from 'js-md5'
import { useUserStore } from '@/store/modules/user'
import { lStorage, setToken } from '@/utils'
import { useStorage } from '@vueuse/core'
import bgImg from '@/assets/images/login_bg.webp'
import api from '@/api'
import { addDynamicRoutes } from '@/router'

const ENTER_VERIFICE_CODE = 20030
const VERIFICE_CODE_INVALID = 20027 //图形验证码已失效
const VERIFICE_CODE_ERROR = 20028 //图形验证码错误或已失效
const userStore = useUserStore()
const title = import.meta.env.VITE_TITLE
const isRemember = useStorage('isRemember', false)
const loading = ref(false)
const showGraphicsCode = ref(false)
const valiCodeUrl = ref('')
const router = useRouter()
const { query } = useRoute()
const r = useRoute()

const loginInfo = ref({
  name: '',
  password: '',
  verifyCode: '',
})

onMounted(() => {
  initLoginInfo()
  getCode()
})

function initLoginInfo() {
  const localLoginInfo = lStorage.get('loginInfo')
  if (localLoginInfo) {
    loginInfo.value.name = localLoginInfo.name || ''
    loginInfo.value.password = localLoginInfo.password || ''
  }
}

async function getCode() {
  const res = await api.getLoginCode()
  valiCodeUrl.value = window.URL.createObjectURL(res)
}

async function handleLogin() {
  const { name, password, verifyCode } = loginInfo.value
  if (!name || !password) {
    $message.warning('请输入用户名和密码')
    return
  }
  try {
    loading.value = true
    $message.loading('正在验证...')
    const res = await userStore.handleLogin({
      username: name,
      password: md5.hex(password.toString()),
      extra: md5.hex(password),
      isEncrypt: false,
      systemVersion: 'standard',
      verifyCode,
    })
    if (res.code === 0) {
      $message.success('登录成功')
      console.log(res)
      setToken(res.token)
      if (isRemember.value) {
        lStorage.set('loginInfo', { name, password })
      } else {
        lStorage.remove('loginInfo')
      }
      console.log(1111, query, r)
      await addDynamicRoutes()
      console.log(2222)
      if (query.redirect) {
        console.log(333)
        const path = query.redirect
        Reflect.deleteProperty(query, 'redirect')
        router.push({ path, query })
      } else {
        console.log(444)
        router.push('/')
      }
    } else if (res.code === ENTER_VERIFICE_CODE) {
      showGraphicsCode.value = true
      $message.error('请输入图形验证码')
    } else if (res.code === VERIFICE_CODE_INVALID) {
      showGraphicsCode.value = true
      $message.error('图形验证码错误或已失效')
    } else if (res.code === VERIFICE_CODE_ERROR) {
      showGraphicsCode.value = true
      $message.error('图形验证码已失效')
    } else {
      $message.warning(res.msg)
    }
  } catch (error) {
    console.error(error)
    $message.removeMessage()
  }
  loading.value = false
}
</script>
