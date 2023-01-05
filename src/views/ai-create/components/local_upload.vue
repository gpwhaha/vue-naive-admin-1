<template>
  <crud-modal v-model:visible="show" :title="title" :show-footer="showFooter" @open="open">
    <type_select v-model:typeId="typeId"></type_select>
    <uploadFile v-model:fileLists="fileLists" :limit="limit"></uploadFile>
    <div w-full text-center my-2><n-button :disabled="isEdit" type="primary" @click="confirm"> 确认 </n-button></div>
  </crud-modal>
</template>

<script setup>
import type_select from './type_select.vue'
const props = defineProps({
  width: {
    type: String,
    default: '600px',
  },
  title: {
    type: String,
    default: '上传合同',
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  limit: {
    type: Number,
    default: 1,
  },
})

const typeId = ref(null)
const fileLists = ref([])

const emit = defineEmits(['update:visible', 'onSave'])
const show = computed({
  get() {
    return props.visible
  },
  set(v) {
    emit('update:visible', v)
  },
})
const isEdit = computed(() => {
  if (typeId.value && fileLists.value.length > 0) {
    return false
  }
  return true
})

function open() {
  typeId.value = null
  fileLists.value = []
}

function confirm() {
  emit('onSave', { typeId: typeId.value, fileLists: fileLists.value })
}
</script>

<style></style>
