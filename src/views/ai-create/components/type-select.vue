<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item
      label-placement="left"
      label="合同类型："
      path="categoryId"
      show-require-mark
      require-mark-placement="left"
    >
      <n-cascader
        v-model:value="model.categoryId"
        placeholder="请选择"
        :expand-trigger="'hover'"
        :options="templateTypeList"
        :check-strategy="'child'"
        label-field="typeName"
        value-field="typeId"
        children-field="child"
        @update:value="update"
      />
    </n-form-item>
  </n-form>
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
const templateTypeList = ref([])
const formRef = ref(null)
// const model = ref({
//   categoryId: props.typeId,
// })
const model = computed({
  get() {
    return {
      categoryId: props.typeId,
    }
  },
  set(v) {
    emit('update:typeId', v)
  },
})
const rules = {
  categoryId: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请选择合同类型')
        }
        return true
      },
      trigger: ['change', 'blur'],
    },
  ],
}

function update(v) {
  emit('update:typeId', v)
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
getContractTypeNew()
</script>

<style lang="scss" scoped></style>
