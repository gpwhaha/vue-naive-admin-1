<template>
  <div flex-1 w-auto p-10 box-border rounded-6 bg-white>
    <div flex w-full justify-between>
      <div font-700 text-16>归档履约</div>
      <div cursor-pointer color-gray @click="toMore">查看更多</div>
    </div>
    <div text-14 color-gray my-8>合同文件快速履约归档，合同数字化管理</div>
    <n-upload
      v-model:file-list="fileList"
      px-50
      my-50
      multiple
      directory-dnd
      show-retry-button
      :action="UPLOAD_FILE_CONTRACT"
      :headers="header"
      :max="5"
      @before-upload="beforeUpload"
      @change="handleUploadChange"
      @remove="handleRemove"
      @finish="handleFinish"
    >
      <n-upload-dragger bg-blue-50>
        <div style="margin-bottom: 12px">
          <n-image preview-disabled :src="fileImg" />
        </div>
        <n-text text-16> 导入存量合同 </n-text>
        <n-p depth="3" m-8>
          将文件拖到此处，或
          <em color-blue>点击上传</em>
        </n-p>
      </n-upload-dragger>
    </n-upload>
    <div flex justify-center items-center w-full>
      <n-image width="20" :src="diamond" />
      <div text-14 ml-10>归档后即刻享有履约提醒，数据分析功能</div>
    </div>
  </div>
</template>
<script setup>
import fileImg from '@/assets/images/upload_flow.png'
import diamond from '@/assets/images/diamond.png'
import { UPLOAD_FILE_CONTRACT } from '@/enums/fileWay'
import { getToken } from '@/utils'
import api from '@/api/index'

const router = useRouter()
const isUpload = ref(false)
const fileList = ref([])
const alreadyFileList = ref([])
const header = ref({
  token: getToken(),
})
const acceptFile = ref(['doc', 'docx'])

function toMore() {
  router.push({
    name: 'template-contracts',
  })
}

/**导入存量合同*/
async function uploadStockContract(files) {
  try {
    const { data, code, msg } = await api.uploadStockContract(files)
    return Promise.resolve({ data, code, msg })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function beforeUpload(data) {
  let suffix = data.file.file?.name.split('.').pop()
  if (!acceptFile.value.includes(suffix)) {
    $message.error('只能上传doc、docx格式的文件，请重新上传')
    return false
  }
  return true
}

async function handleUploadChange(data) {
  fileList.value = data.fileList
  if (fileList.value.length === alreadyFileList.value.length && isUpload.value) {
    const { code, msg } = await uploadStockContract(alreadyFileList.value.map((i) => i.url))
    if (code === 0) {
      $message.success('上传成功')
      $dialog.success({
        content: '是否跳转至列表页',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          $message.success('确定')
          alreadyFileList.value = []
          fileList.value = []
        },
        onNegativeClick: () => {
          $message.warning('取消')
          alreadyFileList.value = []
          fileList.value = []
        },
      })
    } else {
      $message.error(msg)
    }
  }
}

function handleRemove(data) {
  alreadyFileList.value = alreadyFileList.value.filter((i) => i.id !== data.file.id)
  isUpload.value = false
  data.file?.url && removeFile([data.file?.url])
}

function handleFinish({ file, event }) {
  let res = JSON.parse((event?.target).response)
  if (res?.code !== 0) {
    $message.error(res.msg)
  }
  file.url = res?.data
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
<style lang="scss"></style>
