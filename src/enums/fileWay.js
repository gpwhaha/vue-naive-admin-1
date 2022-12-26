const BASE_URL = import.meta.env.VITE_BASE_API

export const UPLOAD_FILE_CONTRACT = `${BASE_URL}/contract/uploadContractFile` //上传文件(智能合同上传)
export const UPLOAD_FILE_ADD_PDF_CONTRACT = `${BASE_URL}/contract/uploadContractCompareFile` //上传文件(智能合同上传,支持pdf)
export const UPLOAD_FILE_CONTRACT_ALL = `${BASE_URL}/contract/uploadFile` //上传文件(智能合同文件上传、不限制类型)
