<template>
  <n-form-item label-placement="left" label="合同类型：" show-require-mark require-mark-placement="left" :rule="rule">
    <n-cascader
      v-model:value="categoryId"
      placeholder="请选择"
      :expand-trigger="'hover'"
      :options="templateTypeList"
      :check-strategy="'child'"
      label-field="typeName"
      value-field="typeId"
      children-field="child"
    />
  </n-form-item>
</template>

<script setup>
import { getContractType } from '@/views/template-manage/api'
const props = defineProps({
  typeId: {
    type: [Number, Object],
    default: null,
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
  trigger: ['change', 'blur'],
  validator() {
    if (categoryId.value) return true
    emit('successChoose')
    return false
  },
  message: '请选择合同类型',
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

<style lang="scss" scoped></style>
