import { defineStore } from "pinia"
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    // 用户Token
    const token = ref('')

    // 定义存储用户Token方法
    const setToken = (newToken) => {
        token.value = newToken
    }

    // 定义移除用户Token方法
    const removeToken = () => {
        token.value = ''
    }

    // 用户基本信息
    const userInfo = ref({})

    // 设置用户信息
    const setUserInfo = (obj) => {
        userInfo.value = obj
    }

    // 导出数据与方法
    return {
        token,
        setToken,
        removeToken,
        userInfo,
        setUserInfo
    }
},{
    // 配置本地持久化
    persist: true
})