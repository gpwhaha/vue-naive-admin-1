<template>
  <div h-24 w-full text-4xl flex justify-center items-center relative box-border>
    <div text-6>{{ query.fileTitle }}</div>
    <div absolute h-full right-0 top-0 box-border>
      <div h-full flex justify-center items-center>
        <n-button type="info" @click="downloadContractFiles"> 下载合同 </n-button>
        <n-button mx-8 @click="router.go(-1)"> 返回 </n-button>
      </div>
    </div>
  </div>
  <div wh-full class="bg-[#f5f6fb]" style="height: 93%" pb-4>
    <yo-zo-office
      :readonly="readonly"
      :open-edit="openEdit"
      :office-file-name="query.fileTitle"
      :office-file-id="query.fileId"
      :office-file-path="query.officeFilePath"
    ></yo-zo-office>
  </div>
</template>

<script setup>
import fileDownload from 'js-file-download'
import { downloadFile, downloadContractFile } from './api'
const router = useRouter()
const { query } = useRoute()
const readonly = ref(true)
const openEdit = ref(false)
const templateContract = ref(false)
const officeFileIdQ = ref(null)
const contractIdQ = ref(null)
const fileTitleQ = ref(null)

async function downloadContractFiles() {
  let res
  if (templateContract.value) {
    res = await downloadFile(officeFileIdQ.value)
  } else {
    res = await downloadContractFile(contractIdQ.value)
  }
  fileDownload(res, `${fileTitleQ.value}.docx`)
}

onMounted(() => {
  const { fileTitle, contractId, fileId, officeFilePath } = query
  fileTitleQ.value = fileTitle
  contractIdQ.value = contractId
  officeFileIdQ.value = fileId
  if (fileId && officeFilePath) {
    templateContract.value = true
  }
})
</script>

<style lang="scss" scoped></style>
