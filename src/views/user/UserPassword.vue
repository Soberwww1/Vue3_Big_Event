<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'
// 导入更新用户密码的API
import { userUpdatePasswordService } from '@/api/user'

// 
import { useUserStore } from '@/stores/index'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const title = '重置密码'

const formRef = ref(null)

// 自定义新密码检验 --- 确保旧密码与新密码不一样
const checkDifferentAsOldPwd = (rule, value, callback) => {
    if (value === form.value.old_pwd) {
        callback(new Error('新旧密码不能一样'))
    } else {
        callback()
    }
}

// 自定义确认密码检验 --- 确保确认密码与新密码一样
const checkSameAsNewPwd = (rule, value, callback) => {
    if (value !== form.value.new_pwd) {
        callback(new Error('确认密码必须和新密码一样'))
    } else {
        callback()
    }
}

const rules = {
    old_pwd: [
        { required: true, message: '请输入原密码', trigger: 'change' },
        { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'change' },
        { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' },
        { validator: checkDifferentAsOldPwd, trigger: 'change' }

    ],
    re_pwd: [
        { required: true, message: '请再次输入新密码', trigger: 'change' },
        { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' },
        { validator: checkSameAsNewPwd, trigger: 'change'}

    ]

}

const defaultForm = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})
const form = ref({})

form.value = { ...defaultForm.value }

const onSubmit = async () => {
    // console.log(form.value)
    // 进行预校验
    await formRef.value.validate()
    // console.log(form.value)
    await userUpdatePasswordService(form.value)
    ElMessage.success('修改密码成功')

    // 退出所有用户信息 --- 重新登录
    userStore.removeToken()
    userStore.setUserInfo({})
    router.push('/login')

}

// 重置密码
const onReset = () => {
    if (!form.value.old_pwd && !form.value.new_pwd && !form.value.re_pwd) {
        ElMessage.warning('当前无需重置')
        return
    }
    form.value = { ...defaultForm.value }
}

</script>

<template>
    <PageContainer :title="title">
        <template #content>
            <el-row>
                <el-col :span="12">
                    <el-form ref="formRef" :rules="rules" :model="form">
                        <el-form-item label="原密码" prop="old_pwd">
                            <el-input type="password" v-model="form.old_pwd"/>
                        </el-form-item>
                        <el-form-item label="新密码" prop="new_pwd">
                            <el-input type="password" v-model="form.new_pwd"/>
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="re_pwd">
                            <el-input type="password" v-model="form.re_pwd"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">修改密码</el-button>
                            <el-button @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </template>
    </PageContainer>
</template>

<style lang="less" scoped>
:deep(.el-form) {
    width: 100%;
    .el-form-item {
        margin-bottom: 20px;
        .el-form-item__label {
            width: 100px;
            text-align: left;
        }
        .el-form-item__content {
            flex: 1;
            max-width: 500px; // 防止输入框太宽
        }
    }
}
</style>