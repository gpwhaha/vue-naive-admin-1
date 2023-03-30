<template>
  <crud-modal v-model:visible="show" :title="title" :show-footer="showFooter" @open="open">
    <type_select v-model:typeId="typeId"></type_select>
    <div w-full text-center my-2><n-button :disabled="isEdit" type="primary" @click="confirm"> 确认 </n-button></div>
  </crud-modal>
</template>

<script setup>
import type_select from './type-select.vue'
const props = defineProps({
  width: {
    type: String,
    default: '600px',
  },
  title: {
    type: String,
    default: '合同概况',
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    required: true,
  },
})
const typeId = ref(null)
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
  if (typeId.value) {
    return false
  }
  return true
})
function open() {
  typeId.value = null
}

function confirm() {
  emit('onSave', { typeId: typeId.value })
}
</script>

<style></style>
