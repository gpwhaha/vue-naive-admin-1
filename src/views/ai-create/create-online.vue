<template>
  <div class="cus-scroll-y wh-full p-4 box-border flex-col bg-[#f5f6fb]">
    <n-spin :show="loading" wh-full>
      <header px-2 mb-4 min-h-14 flex justify-between items-center>
        <h2 color="#333" text-7 font-700>在线起草</h2>
        <n-button type="primary">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新建空白文档
        </n-button>
      </header>
      <div wh-full flex flex-col>
        <div class="create">
          <div class="box-item bg-white">
            <div class="head">
              <div class="name">本地上传合同</div>
            </div>
            <div class="bg-img" @click="openLocalUpload">
              <n-image :src="LocalCreateImg" preview-disabled></n-image>
            </div>

            <div class="foot">
              <div class="description">支持格式为：doc、docx（上传单个文件大小不超过20M）</div>
            </div>
          </div>
          <div class="box-item bg-white"></div>
          <div class="box-item bg-white"></div>
        </div>
        <div class="rencent-use my-4 bg-white"></div>
      </div>
    </n-spin>
    <localUpload v-model:visible="localUploadDialog" @on-save="loaclCreate"></localUpload>
  </div>
</template>

<script setup>
import AICreateImg from '@/assets/images/AICreate.png'
import TemplateCreateImg from '@/assets/images/TemplateCreate.png'
import LocalCreateImg from '@/assets/images/LocalCreate.png'
import localUpload from './components/local_upload.vue'
import api from '@/api/index'
const router = useRouter()
const localUploadDialog = ref(false)
const loading = ref(false)
/**打开本地上传弹窗*/
function openLocalUpload() {
  localUploadDialog.value = true
}
async function loaclCreate(form) {
  localUploadDialog.value = false
  loading.value = true
  try {
    let param = {
      typeId: form.typeId,
      draftType: 0,
      fileId: form.fileLists[0].file,
    }
    const { data } = await createContract(param)
    const {
      data: { contractInfo, contractDocumentView },
    } = await queryDraftDetail(data.contractId)
    router.push({
      name: 'editContract',
      query: {
        fromType: 0,
        contractId: contractInfo.contractId,
        version: data.version,
        officeFileId: contractDocumentView.fileId,
        officeFilePath: contractDocumentView.filePath,
      },
    })
  } finally {
    loading.value = false
  }
}

/**智能起草*/
async function createContract(param) {
  const { data, code, msg } = await api.createContract(param)
  if (code === 0) {
    return Promise.resolve({ data, code, msg })
  } else {
    $message.error(msg)
    return Promise.reject({ data, code, msg })
  }
}

/**获取合同基本信息*/
async function queryDraftDetail(contractId) {
  const { data, code, msg } = await api.queryDraftDetail(contractId)
  if (code === 0) {
    return Promise.resolve({ data, code, msg })
  } else {
    $message.error(msg)
    return Promise.reject({ data, code, msg })
  }
}
</script>

<style lang="scss" scoped>
:deep(.n-spin-content) {
  height: 95%;
  width: 100%;
}
.create {
  flex: 2;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;

  .box-item {
    border-radius: 0.5rem;
    display: grid;
    justify-items: center;
    grid-template-rows: 18rem 15rem 1fr;
    box-sizing: border-box;
    padding: 2rem;

    .head {
      width: 100%;
      display: grid;
      justify-items: center;

      .select {
        width: 90%;
        display: flex;
        margin-top: -3rem;

        .select-btn {
          margin-left: 1rem;
        }
      }

      .name {
        font-size: 1.7rem;
        font-weight: bolder;
        margin-top: 1rem;
      }
    }

    .bg-img {
      text-align: center;
      height: 14rem;
      cursor: pointer;
    }

    .foot {
      display: grid;
      justify-items: center;
      .description {
        color: #999999;
        font-size: 1.5rem;
        margin-top: 4rem;
      }

      .btn {
        margin-top: 2rem;
      }
    }
  }
}
.rencent-use {
  flex: 1;
  margin-top: 1rem;
  border-radius: 0.5rem;
}
</style>
