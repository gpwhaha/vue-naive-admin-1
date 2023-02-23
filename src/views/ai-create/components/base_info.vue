<template>
  <n-spin wh-full :show="contentLoading">
    <div wh-full p-8>
      <div flex items-center justify-between>
        <n-h4 mb0 prefix="bar"> 基本信息 </n-h4>
        <n-button text :loading="loading" @click="handleValidateSave"> 保存 </n-button>
      </div>
      <n-divider />
      <div class="cus-scroll-y contain pr-1">
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="top"
          label-width="auto"
          require-mark-placement="left"
          :size="size"
        >
          <n-form-item label="合同名称" path="title">
            <n-input v-model:value="model.title" maxlength="30" clearable placeholder="合同名称" />
          </n-form-item>
          <n-form-item label="合同金额" path="" :feedback="inputFeedback" :validation-status="inputValidationStatus">
            <n-input v-model:value="model.amount" maxlength="12" clearable placeholder="合同金额" />
          </n-form-item>
          <n-form-item label="合同类型" path="typeId">
            <n-cascader
              v-model:value="model.typeId"
              placeholder="请选择"
              :expand-trigger="'hover'"
              :options="templateTypeList"
              :check-strategy="'child'"
              label-field="typeName"
              value-field="typeId"
              children-field="child"
              clearable
            />
          </n-form-item>
          <n-form-item label="经济类型" path="economyType">
            <n-select v-model:value="model.economyType" :options="economicTypeList" clearable placeholder="经济类型" />
          </n-form-item>
          <n-form-item label="己方类型" path="ownType">
            <n-select v-model:value="model.ownType" :options="ownTypeList" clearable placeholder="己方类型" />
          </n-form-item>
          <div wh-full mb-4>
            <div flex justify-between items-center mb-2>
              <div text-6>相对方</div>
              <n-button text @click="addItem"> <TheIcon icon="material-symbols:add" :size="18" /> 新增相对方 </n-button>
            </div>
            <n-card
              v-for="(item, index) in model.relatives"
              :key="index"
              hoverable
              mb-4
              :content-style="{ padding: '1rem' }"
            >
              <div relative>
                <n-form-item
                  :label="`相对方${index + 1}`"
                  :path="`relatives[${index}].relativeOrgId`"
                  :rule="{
                    required: true,
                    message: `请选择相对方${index + 1}`,
                    trigger: ['change', 'blur'],
                  }"
                >
                  <n-select
                    v-model:value="item.relativeOrgId"
                    :options="enterpriseNameOptions"
                    clearable
                    filterable
                    placeholder="相对方"
                    @focus="focusSelect"
                    ><template #action>
                      <div flex items-center>
                        <n-input v-model:value="relativeName" maxlength="20" clearable placeholder="相对方名称" />
                        <n-divider vertical />
                        <n-button type="text" class="color-[var(--primary-color)] p0 mx0" @click="addRelative(index)">
                          添加相对方
                        </n-button>
                      </div>
                    </template></n-select
                  >
                </n-form-item>
                <TheIcon
                  v-if="model.relatives.length > 1"
                  icon="material-symbols:delete"
                  :size="18"
                  class="absolute right-0 top-0 color-red cursor-pointer"
                  @click="removeItem(index)"
                />
              </div>

              <n-form-item
                :label="`相对方类型${index + 1}`"
                :path="`relatives[${index}].relativeType`"
                :rule="{
                  required: true,
                  message: `请选择相对方类型${index + 1}`,
                  trigger: ['change', 'blur'],
                }"
              >
                <n-select
                  v-model:value="item.relativeType"
                  :options="relativeTypeList"
                  clearable
                  placeholder="相对方类型"
                />
              </n-form-item>
            </n-card>
          </div>
          <!-- <div w-full flex justify-center>
            <n-button type="primary" :loading="loading" @click="handleValidateSave"> 保存 </n-button>
          </div> -->
        </n-form>
      </div>
    </div>
  </n-spin>
</template>

<script setup>
import { getContractType } from '@/views/template-manage/api'
import { modifyContractBase, addRelativeCompany } from '../api'
import api from '@/api/index'

const props = defineProps({
  form: {
    type: Object,
    default: () => {},
  },
})
const contentLoading = ref(false)
const loading = ref(false)
const relativeName = ref(null)
const templateTypeList = ref([])
const ownTypeList = ref([])
const relativeTypeList = ref([])
const economicTypeList = ref([])
const enterpriseNameOptions = ref([])
const phoneValite = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
const size = 'medium'
const formRef = ref(null)
const model = ref({
  contractId: null,
  title: null,
  amount: null,
  typeId: null,
  economyType: null,
  ownType: null,
  relatives: [],
  version: null,
})
const rules = {
  title: {
    required: true,
    trigger: ['blur', 'change'],
    message: '合同名称不能为空',
  },
  amount: {
    validator(rule, value) {
      return phoneValite.test(value)
    },
    required: false,
    trigger: ['input', 'blur'],
    message: '请填写正确的合同金额，支持保留两位小数',
  },
  typeId: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请选择合同类型')
      }
      return true
    },
    trigger: ['input', 'change', 'blur'],
    message: '合同类型不能为空',
  },
  economyType: {
    required: true,
    trigger: ['blur', 'change'],
    message: '经济类型不能为空',
  },
  ownType: {
    required: true,
    trigger: ['blur', 'change'],
    message: '己方类型不能为空',
  },
  relatives: {
    type: 'array',
    required: true,
    trigger: ['blur', 'change'],
    message: '相对方不能为空',
  },
}

const emit = defineEmits(['successSave'])

watch(
  props.form,
  (val) => {
    let param = JSON.parse(JSON.stringify(val))
    model.value.contractId = param.contractId
    model.value.title = param.title
    model.value.amount = param.amount ? param.amount + '' : null
    model.value.typeId = param.typeId
    model.value.economyType = param.economyType
    model.value.ownTypeValue = param.ownTypeValue
    model.value.ownType = param.ownType
    model.value.relatives = param.relatives
    model.value.version = param.version
    contentLoading.value = false
  },
  { immediate: true, deep: true }
)

watch(
  [() => model.value.ownType, () => model.value.relatives],
  (val) => {
    model.value.ownType = val[0]
    if (Array.isArray(val[1])) {
      let choosedRelatives = val[1].map((j) => j.relativeType)
      ownTypeList.value.forEach((i) => {
        if (choosedRelatives.includes(i.value)) {
          i.disabled = true
        } else {
          i.disabled = false
        }
      })
      relativeTypeList.value.forEach((i) => {
        if (i.value === val[0] || choosedRelatives.includes(i.value)) {
          i.disabled = true
        } else {
          i.disabled = false
        }
      })
    }
  },
  { immediate: true, deep: true }
)

const inputFeedback = computed(() => {
  return createFeedback(model.value.amount)
})

const inputValidationStatus = computed(() => {
  return createStatus(model.value.amount)
})

function createFeedback(value) {
  if (value && !phoneValite.test(value)) return '请填写正确的合同金额，支持保留两位小数'
  return ''
}

function createStatus(value) {
  if (value && !phoneValite.test(value)) return 'error'
  return void 0
}

function handleValidateSave(e) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (model.value.amount && !phoneValite.test(model.value.amount)) return
      contentLoading.value = true
      const code = await modifyContractBaseInfo(model.value)
      if (code === 0) {
        emit('successSave')
      }
    } else {
      $message.error('请填写完整信息')
    }
  })
}

//修改合同基本信息
async function modifyContractBaseInfo(data) {
  try {
    contentLoading.value = true
    const { code, msg } = await modifyContractBase(data)
    if (code === 0) {
      $message.success('保存成功')
    } else {
      $message.error(msg)
    }
    return Promise.resolve(code)
  } finally {
    contentLoading.value = false
  }
}

const removeItem = (index) => {
  model.value.relatives.splice(index, 1)
}

const addItem = () => {
  model.value.relatives.push({ relativeOrgId: null, relativeType: null })
}

function focusSelect() {
  relativeName.value = null
}

function addRelative(index) {
  if (!relativeName.value) {
    return $message.warning('请填写相对方名称')
  }
  $dialog.info({
    title: '提示',
    content: `确认添加 ${relativeName.value} 吗`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        contentLoading.value = true
        let param = {
          companyName: relativeName.value,
          bank: '',
          accountName: '',
          bankAccountNo: '',
          taxpayersNo: '',
          address: '',
          phone: '',
        }
        const { code, msg } = await addRelativeCompany(param)
        if (code === 0) {
          enterpriseNameOptions.value = await queryRelativeList()
          let find = enterpriseNameOptions.value.find((i) => i.label === relativeName.value)
          if (find) {
            model.value.relatives[index].relativeOrgId = find.value
            $message.success('添加成功')
          }
        } else {
          $message.error(msg)
        }
      } finally {
        contentLoading.value = false
      }
    },
    onNegativeClick: () => {
      relativeName.value = null
      $message.error('已取消')
    },
  })
}

//获取相对方  新
async function queryRelativeList(companyName = '') {
  let arr = []
  let param = {
    companyName: companyName,
    begin: 0,
    pageSize: 9999,
  }
  const { code, msg, data } = await api.queryRelativeList(param)
  if (code === 0) {
    if (data.relatives.length > 0) {
      arr = data.relatives.map((item) => {
        return {
          label: item.companyName,
          value: item.id,
        }
      })
    }
  } else {
    $message.error(msg)
  }
  return Promise.resolve(arr)
}

//查询合同类型 所有
async function getContractTypeNew() {
  const { code, msg, data } = await getContractType()
  if (code === 0) {
    if (Array.isArray(data) && data.length > 0) {
      data
        .sort((a, b) => a.sort - b.sort)
        .forEach((i) => {
          i.child.sort((a, b) => a.sort - b.sort)
        })
      templateTypeList.value = data
    }
  } else {
    $message.error(msg)
  }
}

//获取字典值(己方类型和经济类型 )
async function getDictonaryValuesType(type) {
  let arr = []
  const { code, msg, data } = await api.getDictonaryValues(type)
  if (code === 0) {
    arr = data.dicValues.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
  } else {
    $message.error(msg)
  }
  return Promise.resolve(arr)
}
onMounted(async () => {
  getContractTypeNew()
  ownTypeList.value = await getDictonaryValuesType('own_type')
  relativeTypeList.value = ownTypeList.value
  economicTypeList.value = await getDictonaryValuesType('economic_type')
  enterpriseNameOptions.value = await queryRelativeList()
})
</script>

<style lang="scss" scoped>
.contain {
  height: 66vh;
}
</style>
