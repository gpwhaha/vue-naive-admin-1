import { request } from '@/utils'

export const getSubsDepartment = (data) => request.post('web/apiShowOrg', data)

export const getDepartmentUsers = ({ id, keyWord, isAuth }) =>
  request.post('web/apiShowDepartUser', { id, keyWord, isAuth })
