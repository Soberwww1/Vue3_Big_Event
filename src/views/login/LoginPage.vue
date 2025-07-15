<!-- 逻辑代码 -->
<script setup>
import { reactive, ref } from 'vue'
// 使用elementPLUS组件图标需要导入
import { User, Lock, Right, Back } from '@element-plus/icons-vue'

// 导入自定义 登录、注册 API
import { userLoginSerive, userRegistService } from '@/api/user'

// 导入pinia仓库 --- 
import { useUserStore } from '@/stores/index'

// 导入路由函数，进行路由跳转
import { useRouter } from 'vue-router'
// 创建router实例
const router = useRouter()

/*
    创建 ref 模板引用 --- 为了elementplus中el-form创建，
    因为el-form组件中想要核验表单数据只能依靠el-form中定义的私有方法 --- validate(),
    而使用 ref模板引用方法 可以获取组件中的私有睡醒（前提组件使用defineExpose方法暴露😋😋😋）
*/
const formRef = ref(null)

// 整个用于提交的表单信息对象 --- 注册\登录 --- 都需要
const form = reactive({
    username: '',
    password: '',
    repassword: ''
})

// 表单验证规则
const rules = {
    // 对于用户名输入进行核验
    username: [
        // 非空检验
        { required: true, message: '请输入用户名', trigger: 'change' },
        // 输入长度检验
        { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'change' },
        // 正则检验
        { pattern: /^\S{5,10}$/, message: '用户名必须是 5-10位 的非空字符', trigger: 'change' }
    ],
    // 对于用户密码输入进行核验
    password: [
        // 非空检验
        { required: true, message: '请输入密码', trigger: 'change' },
        // 正则检验 --- 需要用户输入6-15 位的非空字符（什么字符都行，但要非空）
        { pattern: /^\S{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'change' }
    ],
    // 对于用户再输入确认密码进行核验
    repassword: [
        // 非空检验
        { required: true, message: '请输入密码', trigger: 'change' },
        // 正则检验 --- 需要用户输入6-15 位的非空字符（什么字符都行，但要非空）
        { pattern: /^\S{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'change' },
        // 自定义检验
        {
            validator: (rule, value, callback) => {
                // 判断 value 是否与之前输入 password 一致
                if (value !== form.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback() // 就算校验成功，也需要callback🤮🤮🤮
                }
            },
            trigger: 'change'
        }
    ]

}

// 登录 or 注册的转换开关
const loginFlag = ref(true)
// 控制 注册页 --- > 登录页；登录页 --- > 注册页
// 定义点击切换 登录/注册 函数
const handleLoginFlag = (value) => {
    loginFlag.value = value
    // 切换时，重置表单内容
    form.username = ''
    form.password = ''
    form.repassword = ''
}

// 注册函数
const handleRegist = async () => {
    // 进行预校验
    await formRef.value.validate()
    const res = await userRegistService(form)
    // console.log(res)
    ElMessage.success(res.data.message)
    // 注册成功，切换为登录页
    loginFlag.value = true
}

const userStore = useUserStore()
// 登录函数
const handleLogin = async () => {
    // 进行预校验
    await formRef.value.validate()
    const res = await userLoginSerive(form)
    // console.log(res)
    // 将登录后token存入pinia仓库
    userStore.setToken(res.data.token)
    ElMessage.success(res.data.message)
    // 路由跳转到layout主页
    router.push('/')
}


</script>

<!-- 模板代码 -->
<template>
    <!-- el-row表示将一行分成24份 -->
    <el-row class="login-page">
        <!-- 登录页左侧背景图片 -->
        <el-col :span="12" class="bg"/>

        <!-- 登录页\注册页 --- 右侧表单主体 -->
        <el-col :span="6" :offset="3" class="login-form">
            <!-- 
            为何el-form中需要监听的组件已经使用v-model双向数据绑定，还需要使用:model
            绑定from，这是为了el-form表单验证做准备，el-form中若想使用rules表单核验，
            必须要有:mode（el-form会从这个属性中拿到对应核验表单对下个的值进行核验）
            -->
            <!-- 登录相关 -->
            <el-form
            v-if="loginFlag"
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="auto"
            autocomplete="off"
            size="large"
            >
                <!-- 登录显示 -->
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>

                <!--
                el-form-item核验需要强制加上prop属性 --- 对应你定义的rules核验规则
                 -->
                <!-- user账户 -->
                <el-form-item prop="username">
                    <el-input
                    :prefix-icon="User"
                    placeholder="请输入用户名"
                    v-model="form.username"
                    />
                </el-form-item>
                <!-- user密码 -->
                <el-form-item prop="password">
                    <el-input
                    :prefix-icon="Lock"
                    placeholder="请输入密码"
                    type="password"
                    show-password
                    v-model="form.password"
                    />
                </el-form-item>
                <!-- 记住我 -->
                <el-form-item>
                    <div class="remenberMe">
                        <!-- 记住我 -->
                        <el-checkbox name="type">记住我</el-checkbox>
                        <!-- 忘记密码? -->
                        <el-link type="primary" underline="never">忘记密码?</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button @click="handleLogin">登录</el-button>
                </el-form-item>
                <!-- 登录 --- > 注册 -->
                <el-form-item>
                    <el-link @click="handleLoginFlag(false)" type="info" underline="never">
                        注册<el-icon><Right /></el-icon>
                    </el-link>
                </el-form-item>

            </el-form>

            <!-- 注册相关 -->
            <el-form
            v-else
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="auto"
            autocomplete="off"
            size="large"
            >
                <!-- 注册显示 -->
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>

                <!-- user账户 -->
                <el-form-item prop="username">
                    <el-input
                    :prefix-icon="User"
                    placeholder="请输入用户名"
                    v-model="form.username"
                    />
                </el-form-item>
                <!-- user密码 -->
                <el-form-item prop="password">
                    <el-input
                    :prefix-icon="Lock"
                    placeholder="请输入密码"
                    type="password"
                    show-password
                    v-model="form.password"
                    />
                </el-form-item>
                <!-- 再次输入密码 -->
                <el-form-item prop="repassword">
                    <el-input
                    :prefix-icon="Lock"
                    placeholder="请再次输入密码"
                    type="password"
                    show-password
                    v-model="form.repassword"
                    />
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button @click="handleRegist">注册</el-button>
                </el-form-item>
                <!-- 注册 --- > 登录 -->
                <el-form-item>
                    <el-link @click="handleLoginFlag(true)" type="info" underline="never">
                        <el-icon><Back /></el-icon>返回
                    </el-link>
                </el-form-item>

            </el-form>
        </el-col>


    </el-row>
</template>

<!-- 样式 -->
<style lang="less" scoped>
// 自定义样式：
// 公共样式
// 主体文件样式
.login-page{
    height: 100vh;
    background-color: white;
    // 左侧背景图样式
    .bg{
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
        url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }
    // 右侧表单主体样式
    .login-form{
        // background-color: skyblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // 表单主体
        .el-form{
            // background-color: pink;
            padding: 0 20px;
            // 输入框
            .el-form-item{
                // background-color: aqua;
               // 表单中的输入框
                .el-input{
                    height: 45px;
                    border-radius: 40px;
                    font-size: 16px;
                }
                // 按钮
                .el-button{
                    background-color: rgb(64, 158, 255),;
                    width: 100%;
                    height: 40px;
                    font-size: 20px;
                    color: white;
                }
                // 超链接
                .el-link {
                    margin-right: 8px;
                }
            }
            .remenberMe{
                font-size: 16px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                // background-color: red;
            }
        }
    }
}
</style>
