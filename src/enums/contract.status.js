export const CONTRACT_STATUS_ALL = ''
export const CONTRACT_STATUS_DRAFT = 0
export const CONTRACT_STATUS_FINALIZED = 1
export const CONTRACT_STATUS_APPROVAL = 2
export const CONTRACT_STATUS_AUTH = 3
export const CONTRACT_STATUS_FINISH = 4
export const CONTRACT_STATUS_STOCK = 5
export const CONTRACT_STATUS_SIGN_ARCHIVE = 6
export const CONTRACT_STATUS_SIGN_COMPLETED = 7
export const CONTRACT_STATUS_PERFORM_ING = 8
export const CONTRACT_STATUS_PERFORM_COMPLETED = 9
export const CONTRACT_STATUS_PERFORM_OVERDUE = 10
export const CONTRACT_STATUS_TERMINATION = 11

export const contractStatus = [
  {
    label: '全部',
    value: CONTRACT_STATUS_ALL,
    color: '#000',
    type: '',
  },
  {
    label: '草稿',
    value: CONTRACT_STATUS_DRAFT,
    color: '#1ec17b',
    type: 'success',
  },
  {
    label: '定稿',
    value: CONTRACT_STATUS_FINALIZED,
    color: '#0a7bff',
    type: 'info',
  },
  {
    label: '签署审批',
    value: CONTRACT_STATUS_APPROVAL,
    color: '#f6a31b',
    type: 'warning',
  },
  {
    label: '签署审批完成',
    value: CONTRACT_STATUS_AUTH,
    color: '#000',
    type: 'info',
  },
  {
    label: '签署审批完成',
    value: CONTRACT_STATUS_FINISH,
    color: '#000',
    type: 'info',
  },
  {
    label: '存量合同',
    value: CONTRACT_STATUS_STOCK,
    color: '#909399',
    type: 'info',
  },
  {
    label: '归档合同',
    value: CONTRACT_STATUS_SIGN_ARCHIVE,
    color: '#909399',
    type: 'info',
  },
  {
    label: '签署完成',
    value: CONTRACT_STATUS_SIGN_COMPLETED,
    color: '#f6a31b',
    type: 'warning',
  },
  {
    label: '履约中',
    value: CONTRACT_STATUS_PERFORM_ING,
    color: '#1ec17b',
    type: 'success',
  },
  {
    label: '履约完成',
    value: CONTRACT_STATUS_PERFORM_COMPLETED,
    color: '#0a7bff',
    type: '',
  },
  {
    label: '履约逾期',
    value: CONTRACT_STATUS_PERFORM_OVERDUE,
    color: '#f34b45',
    type: 'error',
  },
  {
    label: '签署中止',
    value: CONTRACT_STATUS_TERMINATION,
    color: '#f34b45',
    type: 'error',
  },
]

export const contractSelectStatus = [
  {
    label: '全部',
    value: CONTRACT_STATUS_ALL,
    color: '#000',
  },
  {
    label: '草稿',
    value: CONTRACT_STATUS_DRAFT,
    color: '#1ec17b',
  },
  {
    label: '定稿',
    value: CONTRACT_STATUS_FINALIZED,
    color: '#0a7bff',
  },
  {
    label: '签署审批',
    value: CONTRACT_STATUS_APPROVAL,
    color: '#f6a31b',
  },
  {
    label: '签署审批完成',
    value: JSON.stringify([CONTRACT_STATUS_AUTH, CONTRACT_STATUS_FINISH]),
    color: '#000',
  },
  {
    label: '存量合同',
    value: CONTRACT_STATUS_STOCK,
    color: '#f74c09',
  },
  {
    label: '归档合同',
    value: CONTRACT_STATUS_SIGN_ARCHIVE,
    color: '#0a7bff',
  },
  {
    label: '签署完成',
    value: CONTRACT_STATUS_SIGN_COMPLETED,
    color: '#0a7bff',
  },
  {
    label: '履约中',
    value: CONTRACT_STATUS_PERFORM_ING,
    color: '#0a7bff',
  },
  {
    label: '履约完成',
    value: CONTRACT_STATUS_PERFORM_COMPLETED,
    color: '#0a7bff',
  },
  {
    label: '履约逾期',
    value: CONTRACT_STATUS_PERFORM_OVERDUE,
    color: '#0a7bff',
  },
  {
    label: '签署中止',
    value: CONTRACT_STATUS_TERMINATION,
    color: '#0a7bff',
  },
]
