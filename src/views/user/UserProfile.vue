<script setup>
import { ref } from 'vue'

// 导入更新用户基本资料的API
import { userUpdateInfoService } from '@/api/user'

// 获取pinia仓库 --- 得到userInfo数据
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const title = '基本资料'

const loading = ref(false)

const formRef = ref(null)

const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        { pattern: /^\S{1,10}$/, message: '用户昵称必须为1-10位非空字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        {
        type: 'email',
        message: '请输入正确的邮箱格式',
        trigger: ['blur', 'change']
        }
    ]

}

const defaultForm = ref({
    id: userStore.userInfo.id,
    username: '',
    nickname: '',
    email: '',
    user_pic: ''
})
const form = ref({})
form.value.id = userStore.userInfo.id

const onSubmit = async () => {
    // 进行预校验
    await formRef.value.validate()
    // console.log(form.value)
    loading.value = true
    await userUpdateInfoService(form.value)
    userStore.setUserInfo(form.value)
    form.value = { ...defaultForm }
    loading.value = false
    ElMessage.success('信息修改成功')
}

</script>

<template>
    <PageContainer :title="title">
        <template #content>
            <el-row>
                <el-col :span="12">
                    <el-form v-loading="loading" ref="formRef" :rules="rules" :model="form">
                        <el-form-item label="登录名称">
                            <el-input :value="userStore.userInfo.username" disabled/>
                        </el-form-item>
                        <el-form-item label="用户昵称" prop="nickname">
                            <el-input v-model="form.nickname"></el-input>
                        </el-form-item>
                        <el-form-item label="用户邮箱" prop="email">
                            <el-input v-model="form.email"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </template>
    </PageContainer>
</template>