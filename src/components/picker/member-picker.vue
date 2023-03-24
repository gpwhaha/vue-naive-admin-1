<template>
  <n-modal
    v-model:show="show"
    :style="{ width }"
    preset="card"
    :title="title"
    size="huge"
    :bordered="false"
    @after-enter="open"
    @after-leave="close"
  >
    <template v-if="showHeader" #header>
      <div w-full flex items-center>
        <div text-7>{{ title }}</div>
        <slot name="header" />
      </div>
    </template>
    <div class="wrapper">
      <div flex wh-full>
        <div flex-1 class="item-box">
          <n-input v-model:value="pattern" clearable placeholder="搜索部门名称" />
          <div class="h-175 cus-scroll-y mt-4">
            <n-tree
              key-field="id"
              label-field="name"
              :pattern="pattern"
              :data="treeData"
              :on-load="handleLoad"
              :show-irrelevant-nodes="showIrrelevantNodes"
              :render-prefix="renderPrefix"
              :render-label="renderLabel"
              :node-props="nodeProps"
              block-line
            />
          </div>
        </div>
        <div flex-1 class="item-box">
          <div text-5 my-3>部门成员</div>
          <n-input
            v-model:value="searchUserName"
            clearable
            placeholder="搜索用户名"
            @input="searchUserLoading = true"
          />
          <n-spin :show="searchUserLoading">
            <div v-if="showUserSearchEmtpy" wh-full text-center color-gray my-6>
              没有找到‘{{ searchUserName }}’相关内容
            </div>
            <div v-else-if="showUserEmpty" wh-full text-center color-gray my-6>暂无数据</div>
            <div v-else wh-full h-160 mt-2 class="cus-scroll-y">
              <div v-for="item in departmentUsers" :key="item.id" my-1 class="check-item" @click="checkUser(item)">
                <div flex items-center>
                  <n-checkbox
                    :checked="checkedIds.includes(item.id)"
                    size="large"
                    @update:checked="checkUser(item)"
                    @click.native="stopDefaultClick($event)"
                  >
                  </n-checkbox>
                  <member-avator :user-id="item.id" :size="30" mx-6></member-avator>
                  <div text-5>
                    <p>{{ item.realName }}</p>
                    <p color-gray>{{ item.userName }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-spin>
        </div>
        <div flex-1 class="item-box">
          <div text-5 my-3>已选中：{{ checked.length }}</div>
          <div wh-full h-170 mt-2 class="cus-scroll-y">
            <div v-for="item in checked" :key="item.id" my-1 class="check-item">
              <div flex items-center>
                <member-avator :user-id="item.id" :size="30" mx-6></member-avator>
                <div text-5>
                  <p>{{ item.realName }}</p>
                  <p color-gray>{{ item.userName }}</p>
                </div>
                <TheIcon class="delete-icon color-gray" icon="ep:close" :size="20" @click="checkUser(item)"></TheIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-if="showFooter" #footer>
      <footer flex justify-end>
        <slot name="footer">
          <n-button @click="show = false">取消</n-button>
          <n-button :loading="loading" ml-20 type="primary" @click="confirm">确认</n-button>
        </slot>
      </footer>
    </template>
  </n-modal>
</template>

<script setup>
import { getSubsDepartment, getDepartmentUsers } from './api'
import TheIcon from '@/components/icon/TheIcon.vue'
const props = defineProps({
  width: {
    type: String,
    default: '94rem',
  },
  title: {
    type: String,
    default: '选择人员',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([, 'close', 'open', 'onSave'])
const show = ref(false)
const pattern = ref('')
const searchUserName = ref('')
const callback = ref(null)
const showIrrelevantNodes = ref(false)
const hasPermission = ref(false)
const searchUserLoading = ref(false)
const multiple = ref(true)
const initialData = ref([])
const treeData = ref([])
const departmentUsers = ref([])
const checked = ref([])
const checkedIds = computed(() => checked.value.map((item) => item.id))
const showUserSearchEmtpy = computed(() => {
  return (
    searchUserName.value !== '' &&
    !searchUserLoading.value &&
    departmentUsers.value &&
    departmentUsers.value.length === 0
  )
})
const showUserEmpty = computed(() => {
  return (
    searchUserName.value === '' &&
    !searchUserLoading.value &&
    departmentUsers.value &&
    departmentUsers.value.length === 0
  )
})

watch(searchUserName, (val) => {
  getSubUsers()
})

async function open() {
  const arr = await getDepartment()
  treeData.value = arr
  emit('open')
}

function close() {
  emit('close')
  doClose(false)
}

function confirm() {
  if (checked.value.length === 0) {
    $message.warning('请选择人员')
    return
  }
  emit('onSave')
  show.value = false
  doClose(true)
}

function showModal(options) {
  show.value = true
  for (let prop in options) {
    if (options.hasOwnProperty(prop)) {
      if (prop === 'initialData') {
        initialData.value = options[prop]
      } else if (prop === 'hasPermission') {
        hasPermission.value = options[prop]
      } else if (prop === 'checked') {
        checked.value = options[prop]
      } else if (prop === 'departmentUsers') {
        departmentUsers.value = options[prop]
      }
    }
  }
  restoreCheckedUsers()
  if (!callback.value) {
    return new Promise((resolve, reject) => {
      callback.value = (action, data) => {
        if (action) resolve(data)
        else reject()
      }
    })
  }
}

function restoreCheckedUsers() {
  const clone = JSON.parse(JSON.stringify(initialData.value))
  if (Array.isArray(clone)) {
    checked.value = clone
  } else {
    checked.value = [clone]
  }
}

function doClose(action) {
  typeof callback.value === 'function' && callback.value(action, JSON.parse(JSON.stringify(checked.value)))
  show.value = false
  callback.value = null
  searchUserName.value = ''
  departmentUsers.value = []
  checked.value = []
}

function stopDefaultClick($event) {
  $event.stopPropagation()
}

function checkUser(user) {
  const index = checked.value.findIndex((item) => item.id === user.id)
  if (multiple.value) {
    if (index == -1) checked.value.push(user)
    else checked.value.splice(index, 1)
  } else {
    if (index === -1) {
      checked.value = [user]
    } else {
      checked.value = []
    }
  }
}

async function getSubUsers(departmentId) {
  if (!departmentId && searchUserName.value === '') {
    searchUserLoading.value = false
    departmentUsers.value = []
    return
  }
  try {
    searchUserLoading.value = true
    const data = await getDepartmentUser(departmentId, searchUserName.value, hasPermission.value)
    departmentUsers.value = data
  } catch {
    departmentUsers.value = []
    $message.error('查询人员失败')
  } finally {
    searchUserLoading.value = false
  }
}

function nodeProps({ option }) {
  return {
    async onClick() {
      const data = await getDepartmentUser(option.id)
      departmentUsers.value = data
    },
  }
}

function renderPrefix({ option }) {
  return h(TheIcon, { icon: 'flat-color-icons:org-unit' })
}

function renderLabel({ option }) {
  return h('div', { style: 'padding: 0.8rem 0; font-size: 1.42rem' }, option.name)
}

function handleLoad(node) {
  return new Promise(async (reslove) => {
    const data = await getDepartment(node.id)
    node.children = data
    if (data.length === 0) {
      node.isLeaf = true
    }
    reslove()
  })
}

async function getDepartment(parentId = 0, parentOrgNo, isAuth = false, orgType = 1, status = 0) {
  const search = { parentOrgNo, parentId, isAuth, orgType, status }
  const { code, data, msg } = await getSubsDepartment(search)
  if (code === 0) {
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((i) => {
        i.isLeaf = false
      })
    }
  } else {
    $message.error(msg)
  }
  return Promise.resolve(data || [])
}

async function getDepartmentUser(id, keyWord, isAuth = false) {
  const search = { id, keyWord, isAuth }
  const { code, data, msg } = await getDepartmentUsers(search)
  if (code === 0) {
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((i) => {
        i.isLeaf = false
      })
    }
  } else {
    $message.error(msg)
  }
  return Promise.resolve(data || [])
}

defineExpose({ showModal })
</script>
<style lang="scss" scoped>
.wrapper {
  height: 50rem;
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 0.8rem;

  :deep(.n-tree .n-tree-node) {
    align-items: center;
  }

  .item-box {
    box-sizing: border-box;
    padding: 1rem;

    .check-item {
      cursor: pointer;
      box-sizing: border-box;
      padding: 0.5rem;
      &:hover {
        background: #eff0f1;
      }
    }

    .delete-icon {
      margin-left: auto;
      margin-right: 0;
    }
  }

  .item-box:nth-of-type(1) {
    border-right: 1px solid #e8e8e8;
  }
  .item-box:nth-of-type(2) {
    border-right: 1px solid #e8e8e8;
  }
}
</style>
