<template>
  <!-- <div id="container" wh-full></div> -->
  <DocumentEditor
    id="docEditor"
    document-server-url="http://192.168.2.26"
    :config="config"
    :events-on-document-ready="onDocumentReady()"
  />
</template>

<script setup>
import { DocumentEditor } from '@onlyoffice/document-editor-vue'

const config = ref({
  document: {
    fileType: 'docx',
    key: 'test',
    title: 'test',
    url: 'http://192.168.6.26:8081/getDoc/test.docx',
    permissions: {
      // 权限控制
      // fillForms: true,
      comment: true, // 评论功能的开关
      copy: true, // 允许复制内容
      download: true, // 是否允许下载（其实就是另存为，因为保存就是保存在服务器）
      edit: true, // 是否允许编辑文档（这里是历史记录，不允许编辑)
      print: true, // 是否允许打印
      review: true, // 可编辑时才可用，功能没试过，应该是协同编辑下的评审
      save: true,
    },
  },
  documentType: 'word',
  type: 'desktop',
  editorConfig: {
    lang: 'zh-CN', // 编辑器ui的语言
    location: 'zh-CN',
    // callbackUrl: 'http://192.168.2.26/url-to-callback.ashx',
    user: {
      // 当前正在view/edit此文档的用户信息
      name: 'gpw', // full name
    },
  },
})
// Header
let oHeader = { alg: 'HS256', typ: 'JWT' }
// Sign JWT, password=OqnHhwQqebCfBe7W6xPC
let sHeader = JSON.stringify(oHeader)
let sPayload = JSON.stringify(config.value)
let sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, 'UIxqWatY0iKd0c8XaFfP')
config.value['token'] = sJWT
console.log(config.value)
onMounted(() => {
  // initOffice()
})

function onDocumentReady() {
  console.log('Document is loaded 111222')
}
function initOffice() {
  try {
    let fileType = 'docx'
    let documentType = 'word'
    const config = {
      documentType: documentType, // 打开的文档类型（详细的看官网）
      document: {
        // 这个字段包含了对文档本身的设置
        fileType: fileType, // 文件类型，必须小写
        key: 'test1111', // 给服务端用的唯一id，同一个id就会获取服务器缓存里的文件（有这个key，就会先根据它去缓存里找），文件一旦被保存过或者修改过，就对应一个新的id；url也能做key但是不能有特殊字符并且长度小于128字符长度
        title: '采购合同', // 文件名
        url: 'http://192.168.6.26:8081/getDoc/test.docx', // 必须绝对路径，源文件所在的地方
        permissions: {
          // 权限控制
          // fillForms: true,
          // comment: false, // 评论功能的开关
          copy: true, // 允许复制内容
          download: true, // 是否允许下载（其实就是另存为，因为保存就是保存在服务器）
          edit: true, // 是否允许编辑文档（这里是历史记录，不允许编辑)
          print: true, // 是否允许打印
          review: true, // 可编辑时才可用，功能没试过，应该是协同编辑下的评审
          save: true,
        },
      },
      editorConfig: {
        // 对编辑器（而非文档本身）的设置
        // callbackUrl: `${process.env.DMS_URL}/xx/xx/config_parser/callback?cycle_id=${option.cycleId}&project_id=${option.projectId}&fileName=${option.title}`, // 指定文档存储服务的绝对路径
        lang: 'zh-CN', // 编辑器ui的语言
        location: '', // 用于设置计量单位 比如us、ca（设成英寸）
        mode: 'edit', // 设定文档打开的时候处于什么状态 默认为edit
        user: {
          // 当前正在view/edit此文档的用户信息
          name: 'gpw', // full name
        },
        customization: {
          // autosave: false,
          forcesave: true, // 启用保存按钮
          logo: {
            image: 'http://minio.xxx.com:xxxx/xx/xx.png',
            imageEmbedded: 'http://xx.xx.xxx.xx/favicon-7.ico',
            url: 'http://xxx.com.cn',
          },
          customer: {
            address: 'xx市xx区xx路700号',
            info: '提供高效、协调的团队协作方式',
            mail: 'xxx@xxx.com.cn',
            name: 'KR',
            www: 'http://xxx.com.cn',
          },
        },
      },
      events: {
        onRequestSaveAs: () => {
          console.log('save file>>>>>>>>>>>>>>')
        },
      },
    }
    // Header
    let oHeader = { alg: 'HS256', typ: 'JWT' }
    // Sign JWT, password=OqnHhwQqebCfBe7W6xPC
    let sHeader = JSON.stringify(oHeader)
    let sPayload = JSON.stringify(config)
    let sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, 'UIxqWatY0iKd0c8XaFfP')
    config['token'] = sJWT

    const docEditor = new DocsAPI.DocEditor('container', config)
    console.log('config', docEditor)
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<style></style>
