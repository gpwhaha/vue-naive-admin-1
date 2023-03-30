<template>
  <AppCommonPage>
    <n-spin wh-full :show="loading"
      ><div flex justify-between p-4 w-full h-24 items-center bg-white>
        <div>
          <div color-blue-700 text-6>{{ form.title }}</div>
          <div color-gray text-5>
            {{ form.contractTpeValue }}<n-divider vertical />合同编号 {{ form.billNo }}<n-divider vertical />创建者：{{
              form.creatorName
            }}<n-divider vertical />
            {{ form.createDate }}
          </div>
        </div>
        <div>
          <n-button mr-4 @click="router.go(-1)">返回</n-button>
          <n-button mr-4>转换为模板</n-button>
          <n-button mr-4>保存至草稿</n-button>
          <n-button type="primary">定稿</n-button>
        </div>
      </div>

      <div flex wh-full p-4 justify-between>
        <div class="wh-full">
          <!-- <yo-zo-office
            v-if="showOffice"
            :office-file-name="'111'"
            :office-file-id="officeFileId"
            :office-file-path="officeFilePath"
          ></yo-zo-office> -->
          <only-office></only-office>
        </div>
        <div class="right flex">
          <div class="menu-bar flex flex-col items-center pt-4 bg-white ml-4 w-28 h-full">
            <div cursor-pointer @click="collapsed = !collapsed">
              <TheIcon :icon="icon" :size="36" />
            </div>
            <div v-for="(menu, index) in menus" :key="index" class="menu-item" @click="clickMenu(menu)">
              <img class="img" :src="menu.img" />
              <div class="menu-name">{{ menu.name }}</div>
              <div v-show="menu.name === chooseMenu && collapsed" class="choose">
                <TheIcon icon="ep:caret-left" :size="28" />
              </div>
            </div>
          </div>

          <div :style="style" class="bar-content wh-full bg-white ml-4">
            <component
              :is="componentName"
              v-if="collapsed"
              :form="form"
              @success-save="queryContractBaseInfo"
            ></component>
          </div>
        </div>
      </div>
    </n-spin>
  </AppCommonPage>
</template>

<script setup>
import { queryContractBase } from './api'
import { formatDateTime } from '@/utils'
import baseImg from '@/assets/images/basicInformation.png'
import negotiate from '@/assets/images/negotiate.png'
import examine from '@/assets/images/examine.png'
import history from '@/assets/images/history.png'
import AnnexeImg from '@/assets/images/Annexe.png'
import BaseInfo from './components/base-info.vue'
import ConsultWith from './components/consult-with.vue'

const enumMenus = {
  1: [
    { name: '基本信息', img: baseImg, componentName: markRaw(BaseInfo) },
    { name: '协商', img: negotiate, componentName: markRaw(ConsultWith) },
    { name: '审查', img: examine, componentName: 'Negotiate' },
    { name: '附件', img: AnnexeImg, componentName: 'Annexes' },
    { name: '历史', img: history, componentName: 'History' },
  ],
  2: [{ name: '审查', img: negotiate, componentName: 'Negotiate' }],
}
const { query } = useRoute()
const router = useRouter()
const showOffice = ref(false)
const loading = ref(false)
const fromType = ref(1)
const contractId = ref(null)
const officeFileId = ref(null)
const officeFilePath = ref(null)
const form = ref({})
const attachments = ref([])
const collapsed = ref(true)
const chooseMenu = ref(enumMenus[1][0].name)
const componentName = ref(enumMenus[1][0].componentName)
const icon = computed(() => (collapsed.value ? 'ep:expand' : 'ep:fold'))
const style = computed(() => (collapsed.value ? 'width: 40rem' : 'width: 0'))
const menus = computed(() => enumMenus[fromType.value])
// fromType.value = query.fromType
contractId.value = query.contractId
officeFileId.value = query.officeFileId
officeFilePath.value = query.officeFilePath

onMounted(async () => {
  loading.value = true
  showOffice.value = false
  await queryContractBaseInfo()
  loading.value = false
  showOffice.value = true
})

//查询合同基本信息
async function queryContractBaseInfo() {
  try {
    // showOffice.value = false
    const { code, msg, data } = await queryContractBase(contractId.value)
    if (code === 0) {
      if (data) {
        form.value.contractId = data.contractId
        form.value.amount = data.amount
        form.value.billNo = data.billNo
        form.value.title = data.title
        form.value.typeId = data.typeId
        form.value.contractTpeValue = data.contractTpeValue
        form.value.economyType = data.economyType
        form.value.ownType = data.ownType
        form.value.ownTypeValue = data.ownTypeValue
        form.value.relatives = data.relatives
        form.value.creator = data.creator
        form.value.creatorName = data.creatorName
        form.value.version = data.version
        form.value.createDate = formatDateTime(data.createDate)
        if ((Array.isArray(data.relatives) && data.relatives.length === 0) || !data.relatives) {
          form.value.relatives = [{ relativeOrgId: null, relativeType: null }]
        }
        attachments.value = data.attachments
        officeFilePath.value = data.yozoPath
        officeFileId.value = data.officeId
      }
      return Promise.resolve(form.value)
    } else {
      $message.error(msg)
    }
  } finally {
    // showOffice.value = true
  }
}

function clickMenu(menus) {
  collapsed.value = true
  chooseMenu.value = menus.name
  componentName.value = menus.componentName
}
</script>

<style lang="scss" scoped>
:deep(.n-spin-content) {
  height: 92%;
}
.menu-item {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2.1rem;
  cursor: pointer;
  .img {
    width: 4rem;
  }
  .menu-name {
    font-size: 1.2rem;
    margin-top: 0.8rem;
  }
  .choose {
    position: absolute;
    right: -0.9rem;
    top: calc(50% - 2.5rem);
    color: #0a7bff;
    font-size: 2.5rem;
  }
}
.bar-content {
  transition: all 0.4s;
}
</style>
