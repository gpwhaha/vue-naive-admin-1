import { defineStore } from 'pinia'
import { JSEncrypt } from 'encryptlong'
import { resetRouter } from '@/router'
import { useTagsStore, usePermissionStore } from '@/store'
import { removeToken, toLogin } from '@/utils'
import api from '@/api/index'
export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
      token: '',
    }
  },
  getters: {
    userId() {
      return this.userInfo?.id
    },
    name() {
      return this.userInfo?.realname
    },
    avatar() {
      return this.userInfo?.avatar
    },
    role() {
      return this.userInfo?.role || []
    },
  },
  actions: {
    async handleLogin({
      username,
      password,
      extra,
      isEncrypt,
      phoneNumber,
      companyCode,
      code,
      systemVersion,
      verifyCode,
    }) {
      username = username.trim()
      return new Promise(async (resolve, reject) => {
        const data = await api.getPublicKey()
        const jsencrypt = new JSEncrypt()
        jsencrypt.setPublicKey(data.data)
        username = encodeURI(jsencrypt.encryptLong(username))
        password = encodeURI(jsencrypt.encryptLong(password))
        if (!isEncrypt) {
          extra = encodeURI(jsencrypt.encryptLong(extra))
        }
        api
          .loginIn({
            username,
            password,
            extra,
            systemVersion,
            isEncrypt,
            phoneNumber,
            companyCode,
            code,
            verifyCode,
          })
          .then((res) => {
            resolve(res)
            this.token = res.token
          })
      })
    },

    // 获取用户相关信息
    async getUserInfo() {
      return new Promise((resolve, reject) => {
        try {
          api
            .getUserInfo(this.token)
            .then((res) => {
              if (res.code === 0) {
                const {
                  id,
                  realname,
                  isAdmin,
                  companyId,
                  phone,
                  mail,
                  role,
                  isFirstLogin,
                  companyName,
                  menuNameList,
                  auth,
                } = res.data
                this.userInfo = {
                  id,
                  realname,
                  isAdmin,
                  companyId,
                  phone,
                  mail,
                  role: ['admin'],
                  isFirstLogin,
                  companyName,
                  menuNameList,
                  auth,
                  avatar: 'https://assets.qszone.com/images/avatar.jpg',
                }
                resolve(res.data)
              } else {
                reject()
              }
            })
            .catch((err) => {
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    },

    async logout() {
      const { resetTags } = useTagsStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetTags()
      resetPermission()
      resetRouter()
      this.$reset()
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
