<template>
  <div v-if="url" wh-full>
    <iframe ref="frame" wh-full :src="url" frameborder="0"></iframe>
  </div>
  <emptyData v-else wh-full text="文档加载失败"></emptyData>
</template>

<script setup>
import api from '@/api'
import { useUserStore } from '@/store/modules/user'
const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  openEdit: {
    type: Boolean,
    default: true,
  },
  temporaryRead: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: '',
  },
  officeFileName: {
    type: String,
    default: '',
  },
  officeFileId: {
    type: String,
    default: '',
  },
  officeFilePath: {
    type: String,
    default: '',
  },
  percentage: {
    type: Number,
    default: 100,
  },
  riskObj: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['initOffice'])
const userStore = useUserStore()
const loadOffice = ref(false)
const frame = ref(null)
const timer = ref(null)
const app = ref(null)
const url = ref(null)

//获取officerUrl
async function getOfficeUrl() {
  try {
    loadOffice.value = true
    let param = {
      method: 1,
      params: {
        userRight: props.temporaryRead ? 2 : props.readonly ? 1 : 0,
        userId: userStore.userId,
        fileId: props.officeFileId,
        fileName: `${props.officeFileName}.docx`,
        filePath: props.officeFilePath,
        userMenuPermission: JSON.stringify({
          download: 0, //隐藏按钮 文件左侧更多按钮
          menubar: props.temporaryRead ? 1 : props.readonly ? 0 : 1,
          menubar_left: props.temporaryRead ? 1 : 0,
        }),
      },
    }
    let params = {
      jsonParams: JSON.stringify(param),
    }
    const res = await api.getOfficeUrl(params)
    if (res.errorCode === '0') {
      url.value = res.result.urls.replace(import.meta.env.VITE_YOZO_URL, import.meta.env.VITE_LOCAL_HOST)
      return Promise.resolve(url.value)
    } else {
      $message.error('文档加载错误')
      return Promise.reject(false)
    }
  } catch (e) {
    return Promise.reject(e)
  } finally {
    loadOffice.value = false
  }
}

//设置显示百分比
function setPercentage(percentage = 100) {
  let YozoOffice = app.value
  YozoOffice.Application.ActiveWindow.View.Zoom.Percentage = percentage
}

//隐藏开启编辑权限后的标记(保护区域的显示状态)
function hideMark() {
  let YozoOffice = app.value
  YozoOffice.Application.ActiveWindow.View.ShowProtects = false
}

//
function removeBr() {
  let YozoOffice = app.value
  YozoOffice.Application.ActiveWindow.View.ShowParagraphs = false
}

//开启编辑权限（只读模式下就可以调用api）
function openEditPermission() {
  let YozoOffice = app.value
  /**
   * 这里随机选中文中某个字作为编辑区，尽量在第一页，避免重复设置光标所在位置为编辑区会导致开启编辑权限失败
   */
  let paraCount = YozoOffice.Application.ActiveDocument.Paragraphs.Count

  let totalCount = YozoOffice.Application.ActiveDocument.Paragraphs.Item(paraCount).Range.End

  if (totalCount >= 500) {
    totalCount = 500
  } else if (totalCount >= 300 && totalCount < 500) {
    totalCount = 300
  } else if (totalCount >= 100 && totalCount < 300) {
    totalCount = 100
  } else if (totalCount >= 0 && totalCount < 100) {
    totalCount = 90
  }
  let randomNum = Math.floor(Math.random() * totalCount + 1)
  YozoOffice.Application.ActiveDocument.Range(randomNum - 1, randomNum).Select()
  YozoOffice.Application.Selection.Editors.Add(-1)
}

onMounted(async () => {
  const url = await getOfficeUrl()
  if (url) {
    let iframe = frame.value
    timer.value = setInterval(() => {
      if (iframe.contentWindow && iframe.contentWindow.YozoOffice) {
        if (iframe.contentWindow.YozoOffice.Application) {
          app.value = iframe.contentWindow.YozoOffice
          setPercentage(props.percentage)
          hideMark()
          removeBr()
          // openEditPermission()
          //只读模式下开启操作权限才能添加评论
          if (props.readonly && props.openEdit) {
            openEditPermission()
          }
          clearInterval(timer.value)
          emit('initOffice')
          loadOffice.value = false
        }
      }
    }, 200)
  }
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style></style>
