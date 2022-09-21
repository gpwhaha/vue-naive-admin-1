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

        <div mt-30 v-if="showGraphicsCode">
          <n-input v-model:value="loginInfo.verifyCode" placeholder="请输入验证码">
            <template #suffix>
              <img
                @click="getCode"
                v-if="valiCodeUrl"
                :src="valiCodeUrl"
                style="cursor: pointer; width: 20rem; height: 90%"
              />
            </template>
          </n-input>
        </div>

        <div mt-20>
          <n-checkbox :checked="isRemember" label="记住我" :on-update:checked="(val) => (isRemember = val)" />
        </div>

        <div mt-20>
          <n-button w-full h-50 rounded-5 text-16 type="primary" :loading="loging" @click="handleLogin">
            登录
          </n-button>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script setup>
import md5 from 'js-md5'
import { lStorage } from '@/utils/cache'
import { setToken } from '@/utils/token'
import { useStorage } from '@vueuse/core'
import bgImg from '@/assets/images/login_bg.webp'
import api from '@/api/index'
import { useUserStore } from '@/store/modules/user'

const ENTER_VERIFICE_CODE = 20030
const VERIFICE_CODE_INVALID = 20027 //图形验证码已失效
const VERIFICE_CODE_ERROR = 20028 //图形验证码错误或已失效
const userStore = useUserStore()
const title = import.meta.env.VITE_TITLE
const isRemember = useStorage('isRemember', false)
const loging = ref(false)
const showGraphicsCode = ref(false)
const valiCodeUrl = ref('')
const router = useRouter()
const { query } = useRoute()

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
    $message.loading('正在验证...')
    loging.value = true
    const res = await userStore.handleLogin({
      username: name,
      password: md5.hex(password.toString()),
      extra: md5.hex(password),
      isEncrypt: false,
      systemVersion: 'standard',
      verifyCode,
    })
    // const res = await api.login({ name, password: password.toString() })

    if (res.code === 0) {
      $message.success('登录成功')
      setToken(res.token)
      if (isRemember.value) {
        lStorage.set('loginInfo', { name, password })
      } else {
        lStorage.remove('loginInfo')
      }
      if (query.redirect) {
        const path = query.redirect
        Reflect.deleteProperty(query, 'redirect')
        router.push({ path, query })
      } else {
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
    $message.error(error.message)
  }
  loging.value = false
}
</script>
