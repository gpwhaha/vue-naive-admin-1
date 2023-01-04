<template>
  <n-upload
    v-model:file-list="fileList"
    w-full
    :multiple="multiple"
    directory-dnd
    show-retry-button
    :action="uploadUrl"
    :headers="header"
    :max="limit"
    @before-upload="beforeUpload"
    @change="handleUploadChange"
    @remove="handleRemove"
    @finish="handleFinish"
  >
    <n-upload-dragger bg-blue-50>
      <div style="margin-bottom: 12px">
        <n-image preview-disabled :src="fileImg" />
      </div>
      <n-text text-6> 将文件拖到此处，或 <em color-blue>点击上传</em> </n-text>
      <n-p depth="3" m-4> </n-p>
      <n-p depth="3" m-4> 支持格式为：{{ fileAcceptText }} </n-p>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup>
import fileImg from '@/assets/images/upload_flow.png'
import { UPLOAD_FILE_CONTRACT } from '@/enums/fileWay'
import { getToken, fileSizeTransform } from '@/utils'
import api from '@/api/index'

const props = defineProps({
  acceptFile: {
    type: Array,
    default: () => ['doc', 'docx'],
  },
  uploadUrl: {
    type: String,
    default: UPLOAD_FILE_CONTRACT,
  },
  fileLists: {
    type: Array,
    default: () => [],
  },
  limit: {
    type: Number,
    default: 5,
  },
  size: {
    type: Number,
    default: 20 * 1024 * 1024,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
})

const isUpload = ref(false)
const alreadyFileList = ref([])
const header = ref({
  token: getToken(),
})

const fileList = computed({
  get() {
    return props.fileLists
  },
  set(v) {
    emit('update:fileLists', v)
  },
})

const fileAcceptText = computed(() => {
  return props.acceptFile.toString().replace(/,/g, '、')
})

const fileSize = computed(() => {
  return fileSizeTransform(props.size)
})

const emit = defineEmits(['successUpload', 'update:fileLists'])

async function beforeUpload(data) {
  let size = data.file.file?.size
  if (size > props.size) {
    $message.warning(`文件超过${fileSize.value}，请重新上传`)
    return false
  }
  let suffix = data.file.file?.name.split('.').pop()
  if (!props.acceptFile.includes(suffix)) {
    $message.warning(`只能上传${fileAcceptText}格式的文件，请重新上传`)
    return false
  }
  return true
}

async function handleUploadChange(data) {
  if (data.fileList.length === alreadyFileList.value.length && isUpload.value) {
    $message.success('上传成功')
    emit('successUpload', alreadyFileList.value)
  }
}

function handleRemove(data) {
  alreadyFileList.value = alreadyFileList.value.filter((i) => i.id !== data.file.id)
  isUpload.value = false
  data.file?.file && removeFile([data.file?.file])
}

function handleFinish({ file, event }) {
  let res = JSON.parse((event?.target).response)
  if (res?.code !== 0) {
    $message.error(res.msg)
  }
  file.file = res?.data
  alreadyFileList.value.push(file)
  isUpload.value = true
  return file
}

/**
 * 删除文件（服务器）
 */
async function removeFile(fileIds) {
  const { code, msg } = await api.delPerformFile(fileIds)
  if (code === 0) {
    $message.success('删除成功')
  } else {
    $message.error(msg)
  }
}
</script>
