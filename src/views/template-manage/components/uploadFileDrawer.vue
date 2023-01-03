<template>
  <n-drawer v-model:show="show" :width="502" @after-enter="open">
    <n-drawer-content header-style="width:50rem;display:flex;justify:center" closable>
      <template #header> <div w-170 flex justify-center text-6>上传模板</div></template>
      <div wh-full flex flex-col justify-between>
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="left"
          :size="size"
        >
          <n-form-item label="合同类型：" path="categoryId">
            <n-tree-select
              v-model:value="model.categoryId"
              key-field="typeId"
              label-field="typeName"
              children-field="child"
              :options="options"
              placeholder="请选择"
              default-expand-all
            />
          </n-form-item>
          <n-form-item label="合同标签：" path="tag">
            <n-select v-model:value="model.tag" :options="templateTypeOptions" placeholder="请选择" />
          </n-form-item>
          <n-form-item label="合同年份：" path="year">
            <n-date-picker
              v-model:formatted-value="model.year"
              w-full
              value-forma="yyyy"
              type="year"
              placeholder="请选择"
            />
          </n-form-item>
          <n-form-item label-placement="top" label="上传模板：（合同名称默认为上传模板名称）" path="fileList">
            <uploadFile v-model:file-lists="model.fileList" :limit="limit"></uploadFile>
          </n-form-item>
        </n-form>
        <div w-full flex justify-center>
          <n-button type="primary" :loading="loading" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { createTpl, editTpl } from '../api'
import { isEmpty } from '@/utils'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  templateTypeOptions: {
    type: Array,
    default: () => [],
  },
  templateTypeList: {
    type: Array,
    default: () => [],
  },
  templateDetail: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['update:visible', 'successSave', 'update:show'])
const show = computed({
  get() {
    return props.visiable
  },
  set(v) {
    emit('update:visible', v)
    emit('update:show', v)
  },
})
const options = computed(() => {
  let arr = props.templateTypeList
  arr.forEach((i) => {
    i.disabled = true
  })
  return arr
})

const limit = computed(() => {
  return isEdit.value ? 1 : 5
})

const loading = ref(false)
const fileList = ref([])
const formRef = ref(null)
const isEdit = ref(false)
const model = ref({ templateId: null, categoryId: null, tag: null, year: null, fileList: [] })
const size = 'medium'
const rules = {
  categoryId: {
    validator(rule, value) {
      if (value) return true
      return false
    },
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择合同分类',
  },
  tag: {
    validator(rule, value) {
      if (props.templateTypeOptions.map((i) => i.value).includes(value)) return true
      return false
    },
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择合同标签',
  },
  year: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择合同年份',
  },
  fileList: {
    type: 'array',
    required: true,
    trigger: ['blur', 'change'],
    message: '请上传合同文件',
  },
}

watch(
  () => props.templateDetail,
  (v) => {
    if (!isEmpty(v)) {
      isEdit.value = true
      model.value.templateId = v.templateId
      model.value.categoryId = v.templateCate
      model.value.tag = v.contractTag
      model.value.year = v.year
      model.value.fileList = [{ id: v.file, name: v.fileName, status: 'finished', file: v.file }]
    } else {
      isEdit.value = false
      model.value.categoryId = null
      model.value.tag = null
      model.value.year = null
      model.value.fileList = []
    }
  },
  { immediate: true, deep: true }
)

function open() {}

function handleValidateButtonClick(e) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        loading.value = true
        let param = {
          templateId: model.value.templateId,
          categoryId: model.value.categoryId,
          tag: model.value.tag,
          year: model.value.year,
          files: model.value.fileList.map((i) => i.file),
        }
        if (isEdit.value) {
          const { code, msg } = await editTpl(param)
          if (code === 0) {
            $message.success('模板更新成功')
            emit('successSave')
            emit('update:show', false)
          } else {
            $message.error(msg)
          }
        } else {
          const { code, msg } = await createTpl(param)
          if (code === 0) {
            $message.success('模板上传成功')
            emit('successSave')
            emit('update:show', false)
          } else {
            $message.error(msg)
          }
        }
      } finally {
        loading.value = false
      }
    } else {
      $message.error('验证失败')
    }
  })
}
</script>

<style scoped lang="scss"></style>
