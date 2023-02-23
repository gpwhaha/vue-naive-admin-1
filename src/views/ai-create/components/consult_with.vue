<template>
  <n-spin wh-full :show="loading">
    <div wh-full p-8>
      <n-tabs v-model:value="activeName" type="line" animated>
        <n-tab name="1"> 协商 </n-tab>
        <n-tab name="2"> 评论 </n-tab>
      </n-tabs>
      <div wh-full py-4>
        <div v-if="activeName === '1'">
          <n-button w-full> <TheIcon icon="mdi:account" :size="18" /> 邀请外部协商者 </n-button>
          <n-input v-model:value="people" type="text" my-6 placeholder="可搜索内部协商者" />
          <n-card content-style="padding: 1rem;">
            <n-scrollbar v-if="userList.length > 0" h-80 @scroll="scroll">
              <div v-for="(item, index) in userList" :key="index" w-full flex items-center>
                <n-avatar round size="small" :src="item.photoUrl" />
                <div mx-4>
                  <div>{{ item.userName }}</div>
                  <div color-gray>{{ item.departName }}</div>
                </div>
                <n-button
                  type="primary"
                  ml-a
                  mr-0
                  :disabled="isInvite(item.userId)"
                  @click="getInviteCode(INNER_USER, item.userId)"
                >
                  {{ isInvite(item.userId) ? '已邀请' : '发送邀请' }}
                </n-button>
              </div>
            </n-scrollbar>
            <emptyData v-else h-90 text="无协商邀请人"></emptyData>
          </n-card>
          <n-h6 mt-4 mb-1 prefix="bar"> 协商参与者 </n-h6>
          <div v-if="inviteList.length > 0" style="height: 30vh" class="cus-scroll-y wh-full">
            <div v-for="(item, index) in inviteList" :key="index" w-full flex items-center>
              <n-avatar round size="small" :src="item.photoUrl" />
              <div mx-4>
                <div w-full flex items-center>
                  <div text-6>{{ item.userName }}</div>
                  <div
                    bg-yellow-500
                    color-white
                    px-4
                    mx-2
                    rounded-2
                    :style="{ backgroundColor: item.inviteStatus == 1 ? 'green' : '' }"
                  >
                    {{ item.inviteStatus == 0 ? '已邀请' : '已查看' }}
                  </div>
                </div>
                <div color-gray text-6>{{ item.departName }}</div>
              </div>
            </div>
          </div>
          <emptyData v-else h-90 text="无协商参与者"></emptyData>
        </div>
        <div v-else>
          <comment></comment>
        </div>
      </div>
    </div>
  </n-spin>
</template>

<script setup>
import { getUser, getUserPhoto, queryInvite, getInvite } from '../api'
import Comment from './comment.vue'

const INNER_USER = 0
const OUTER_USER = 1
const props = defineProps({
  form: {
    type: Object,
    default: () => {},
  },
})
const loading = ref(false)
const activeName = ref('1')
const people = ref(null)
const userList = ref([])
const inviteList = ref([])
const search = ref({
  pageNo: 1,
  pageSize: 10,
  userName: null,
})

function scroll(event) {
  const dom = event.target
  const clientHeight = dom.clientHeight
  const scrollTop = dom.scrollTop
  const scrollHeight = dom.scrollHeight
  if (clientHeight + scrollTop === scrollHeight) {
    search.value.pageNo++
    getToInviteUsers()
  }
}

function isInvite(invitedID) {
  return inviteList.value.map((i) => i.inviteUserId).includes(invitedID)
}

async function getInviteCode(inviteType, inviteUserId, inviteUserPhone, contractPassWord, expireTime) {
  let params = {
    contractId: props.form.contractId,
    inviteType,
    inviteUserId,
    inviteUserPhone,
    contractPassWord,
    expireTime,
  }
  const { data, code, msg } = await getInvite(params)
  if (code === 0) {
    getParticipators()
  } else {
    $message.error(msg)
  }
  return Promise.resolve(data)
}

async function getToInviteUsers() {
  loading.value = true
  let params = {
    page: search.value.pageNo,
    pageSize: search.value.pageSize,
    userName: search.value.userName,
  }
  try {
    const { data, code, msg } = await getUser(params)
    if (code === 0) {
      if (Array.isArray(data?.item)) {
        for (const iterator of data.item) {
          if (iterator.photo) {
            const url = await getUserPhotoUrl(iterator.photo)
            iterator.photoUrl = url
          } else {
            iterator.photoUrl = null
          }
        }
        userList.value.push(...data.item)
      }
    } else {
      $message.error(msg)
    }
  } finally {
    loading.value = false
  }
}

//被邀请者列表
async function getParticipators() {
  const { data, code, msg } = await queryInvite(props.form.contractId)
  if (code === 0) {
    for (const iterator of data) {
      if (iterator.photo) {
        const url = await getUserPhotoUrl(iterator.photo)
        iterator.photoUrl = url
      } else {
        iterator.photoUrl = null
      }
    }
    inviteList.value = data
  } else {
    $message.error(msg)
  }
}

async function getUserPhotoUrl(photoId) {
  if (!photoId) return null
  const data = await getUserPhoto(photoId)
  let url = window.URL.createObjectURL(new Blob([data]))
  return Promise.resolve(url)
}

getParticipators()
getToInviteUsers()
</script>

<style></style>
