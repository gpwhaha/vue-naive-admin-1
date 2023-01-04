<template>
  <n-form-item label-placement="left" label="合同类型：" show-require-mark require-mark-placement="left" :rule="rule">
    <n-tree-select
      v-model:value="categoryId"
      key-field="typeId"
      label-field="typeName"
      children-field="child"
      :options="options"
      placeholder="请选择"
    />
  </n-form-item>
</template>

<script setup>
import { getContractType } from '@/views/template-manage/api'
const props = defineProps({
  typeId: {
    type: Number,
    default: -1,
  },
})
const emit = defineEmits(['update:typeId', 'successChoose'])
const categoryId = computed({
  get() {
    return props.typeId
  },
  set(v) {
    emit('update:typeId', v)
  },
})
const templateTypeList = ref([])
const rule = ref({
  trigger: ['blur', 'change'],
  validator() {
    if (categoryId.value > -1) return true
    emit('successChoose')
    return false
  },
  message: '请选择合同类型',
})
const options = computed(() => {
  let arr = templateTypeList.value
  arr.forEach((i) => {
    i.disabled = true
  })
  return arr
})
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
getContractTypeNew()
</script>

<style></style>
