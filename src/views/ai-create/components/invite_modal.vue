<template>
  <crud-modal v-model:visible="show" :width="width" show-header :show-footer="showFooter" @open="open"
    ><template #header>
      <div text-6>{{ title }}</div>
    </template>
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-align="left"
      label-width="auto"
      :size="size"
    >
      <div flex justify-between items-center mb-2>
        <div text-5>设置协商人手机号</div>
      </div>
      <n-form-item label="" path="phone" mt-1>
        <n-input v-model:value="model.phone" :maxlength="11" class="phone-input" placeholder="请输入手机号" clearable>
          <template #suffix><n-divider vertical /><n-button text @click="addItem"> 添加手机号 </n-button></template>
        </n-input>
      </n-form-item>
      <div mb-6>
        <n-tag v-for="(item, index) in model.phoneList" :key="index" mr-3 mb-2 closable @close="removeItem(index)">
          {{ item.phone }}
        </n-tag>
      </div>
      <div flex items-center mb-5>
        <div mr-5 text-5>是否设置访问密码</div>
        <n-switch v-model:value="model.setPwd" :round="false" @update:value="setRandomPwd" />
      </div>
      <n-form-item v-if="model.setPwd" label="" path="pwd">
        <n-input-group>
          <n-input v-model:value="model.pwd" readonly maxlength="4" minlength="4" placeholder="访问密码" />
          <n-input-group-label @click="setRandomPwd">
            <TheIcon icon="mdi:refresh" style="line-height: 1.8" :size="20" />
          </n-input-group-label>
        </n-input-group>
      </n-form-item>
      <div flex items-center mb-5>
        <div mr-5 text-5>是否设置访问截止时间</div>
        <n-switch v-model:value="model.deadLine" :round="false" />
      </div>
      <n-form-item v-if="model.deadLine" label="" path="date">
        <n-date-picker
          v-model:formatted-value="model.date"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          style="width: 100%"
        />
      </n-form-item>
      <div flex items-center mb-5>
        <div mr-5 text-5>链接分享</div>
      </div>
      <div flex items-center mb-5>
        <n-input ref="linkInput" v-model:value="inviteLink" readonly placeholder="获取链接的人可阅读评论" />
        <n-button type="primary" ml-2 @click="copyLink">
          {{ linkName }}
        </n-button>
      </div>
      <div flex items-center>
        <div mr-5 text-5>分享方式</div>
      </div>
    </n-form>
  </crud-modal>
</template>

<script setup>
import { phoneValite, convertChineseToNumber, digitUppercase, Base64 } from '@/utils/common'
import { getInvite } from '../api'
const props = defineProps({
  width: {
    type: String,
    default: '62rem',
  },
  title: {
    type: String,
    default: '分享链接邀请外部协商者',
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  contractId: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const INNER_USER = 0
const OUTER_USER = 1
const size = 'medium'
const localhostPath = ref(null)
const inviteLink = ref(null)
const linkInput = ref(null)
const linkName = ref('生成链接')
const inviteCode = ref('')
const formRef = ref(null)
const model = ref({
  phoneList: [],
  phone: null,
  setPwd: false,
  pwd: null,
  deadLine: false,
  date: null,
})
const rules = {
  phone: {
    key: 'phone',
    required: false,
    message: `请输入正确的手机号`,
    trigger: ['input', 'change'],
    validator(rule, value) {
      return phoneValite.test(value)
    },
  },
  pwd: {
    key: 'pwd',
    required: true,
    trigger: ['blur', 'change'],
    message: '访问密码不能为空',
  },
  date: {
    key: 'date',
    required: true,
    trigger: ['blur', 'change'],
    message: '截止时间不能为空',
  },
}

const emit = defineEmits(['update:visible', 'onSave', 'getParticipators'])
const show = computed({
  get() {
    return props.visible
  },
  set(v) {
    emit('update:visible', v)
  },
})

watch(
  model,
  () => {
    inviteLink.value = null
    linkName.value = '生成链接'
  },
  { deep: true }
)

const removeItem = (index) => {
  // if (model.value.phoneList.length === 1) return $message.warning('至少设置一位协商人手机号')
  model.value.phoneList.splice(index, 1)
}

const addItem = () => {
  formRef.value?.validate(
    (errors) => {
      if (!errors) {
        if (!model.value.phoneList.find((i) => i.phone === model.value.phone)) {
          model.value.phoneList.push({ phone: model.value.phone })
          model.value.phone = null
        } else {
          $message.warning('该手机号已添加')
        }
      }
    },
    (rule) => {
      return rule?.key === 'phone'
    }
  )
}

//生成随机四位数密码
function setRandomPwd() {
  model.value.pwd = Math.floor(Math.random() * 10000).toString()
  while (model.value.pwd.toString().length !== 4) {
    model.value.pwd = Math.floor(Math.random() * 10000).toString()
  }
}

function open() {
  let wPath = window.document.location.href
  let pathName = route.path
  let pos = wPath.indexOf(pathName)
  localhostPath.value = wPath.substring(0, pos)
  model.value = { phoneList: [], phone: null, setPwd: false, pwd: null, deadLine: false, date: null }
}

function copyLink(e) {
  e.preventDefault()
  formRef.value?.validate(
    async (errors) => {
      if (!errors) {
        if (model.value.phoneList.length === 0) {
          return $message.warning('至少添加一位协商人手机号')
        }
        if (!inviteLink.value) {
          inviteLink.value = await generateUrl()
        }
        setTimeout(() => {
          linkInput.value.select()
          document.execCommand('copy')
          $message.success('复制成功')
          linkName.value = '复制成功'
        }, 10)
      } else {
        $message.error('请先完善协商信息')
      }
    },
    (rule) => {
      return rule?.key === 'pwd' || rule?.key === 'date'
    }
  )
}

async function generateUrl() {
  let phoneList = model.value.phoneList.map((item) => item.phone).filter(Boolean)
  let param = {
    contractId: props.contractId,
    inviteType: 1,
    inviteUserPhone: phoneList.toString(),
    contractPassWord: model.value.setPwd ? model.value.pwd : '',
    expireTime: model.value.date,
  }
  if (!inviteCode.value) {
    inviteCode.value = await getUserInviteCode(OUTER_USER, '', phoneList, param.contractPassWord, param.expireTime)
  }
  param.inviteCode = inviteCode.value
  let encodeData = Base64.encode(JSON.stringify(param))
  let inviteLink = `${localhostPath.value}/sharedLoginPage?hideMenu=true&inviteCode=${inviteCode.value}&data=${encodeData}`
  return Promise.resolve(inviteLink)
}

async function getUserInviteCode(inviteType, inviteUserId, inviteUserPhone, contractPassWord, expireTime) {
  let params = {
    contractId: props.contractId,
    inviteType,
    inviteUserId,
    inviteUserPhone,
    contractPassWord,
    expireTime,
  }
  const { data, code, msg } = await getInvite(params)
  if (code === 0) {
    emit('getParticipators')
  } else {
    $message.error(msg)
  }
  return Promise.resolve(data)
}
</script>

<style lang="scss" scoped>
.phone_contain {
  max-height: 20vh;
  padding-right: 0.2rem;
}

:deep(.n-input) {
  border-color: transparent !important;
}
</style>
