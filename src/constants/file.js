//不同的设备产生的照片

import Common from '@/constants/common'
import { getToken } from '@/utils'
import { hex_sha1 } from '@/utils/common/sha'
const baseUrl = import.meta.env.VITE_BASE_API
export default class ImageType {
  //用印宝照片
  static lnkImage = 0
  //人脸照片
  static faceImage = 1
  //应急照片
  static emergencyImage = 2
  //补拍照片
  static makeUpImage = 3

  static downloadFileUrl = `${baseUrl}/file/downLoadFile`
  //头像url
  static avatorUrl = `${baseUrl}web/showPhotoWithSig`
  //印章头像
  static sealAvatorUrl = `${baseUrl}web/showSealImgWithSig`
  //登录logo
  static logoUrl = `${baseUrl}web/showLogo`
  //上传头像url
  static uploadFileUrl = `${baseUrl}/file/uploadFile`
  //盖章图片补传
  static makeUpUrl = `${baseUrl}web/extraSave`
  //批量导入人员
  static branchImportUserUrl = `${baseUrl}web/importUserData`
  //批量导入印章
  static branchImportSealUrl = `${baseUrl}web/importSealBaseData`
  //文档每页地址
  static documentPageUrl = `${baseUrl}file/showFileCutImage`
  //盖章图片url
  static sealImageUrl = `${baseUrl}file/showAgreementImage`
  //通用图片url
  static commonImageUrl = `${baseUrl}file/showImage`
  //上传电子印章模板
  static uploadEleSealTemplete = `${baseUrl}file/uploadFileAndCut`
  // 电子签章章面
  static eleSealImgUrl = `${baseUrl}file/showEleSealImageBySealId`

  /**
   * 获取电子签章单页图片
   * @param {*} fileId
   */
  static showElectronicSignImage(pageId) {
    return `${baseUrl}file/showElectronicSignImage?token=${encodeURIComponent(
      getToken()
    )}&code=${pageId}`
  }
  /**
   * 获取通用图片url
   * @param {*} fileId
   */
  static getCommonImageUrl(fileId) {
    let signature = [getToken(), fileId]
    signature.sort()
    return `${baseUrl}file/showImage?token=${encodeURIComponent(
      getToken()
    )}&code=${fileId}&key=${hex_sha1(
      encodeURIComponent(`${Common.signatureKey};${signature.join(';')}`)
    )}`
  }

  /**
   * 获取word文档每一页图片
   * @param {*} fileId  文件id
   * @param {*} page  页码
   */
  static getImageOfWordByPage(fileId, page, type) {
    const suffixUrl = `&code=${fileId}-${page}&type=${type}`
    return `${baseUrl}file/showFileCutImage?token=${encodeURIComponent(
      getToken()
    )}${suffixUrl}`
  }
  /**
   * 获取pdfUrl
   * @param {*} fileId
   */
  static getPdfUrl(fileId) {
    return `${baseUrl}file/showPdf?token=${encodeURIComponent(
      getToken()
    )}&fileId=${fileId}`
  }

  /**
   * 获取盖章图片url
   * @param {*} fileId  文件id
   * @param {*} type  图片类型  S-压缩图  L-原图  C-裁剪图
   */
  static getSealImageUrl(fileId, type) {
    return `${baseUrl}file/showAgreementImage?token=${encodeURIComponent(
      getToken()
    )}&code=${fileId}&type=${type}`
  }
}
