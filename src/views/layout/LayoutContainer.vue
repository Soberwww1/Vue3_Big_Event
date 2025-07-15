<script setup>
import imgsrc from '@/assets/default.png'

// 导入中英文语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

// 导入图标
import { CaretBottom, Management, Promotion, UserFilled, User, Crop, EditPen, SwitchButton, Warning } from '@element-plus/icons-vue'

// 导入基本函数
import { onMounted, ref, computed, watch } from 'vue'

// 在框架渲染成功后进行数据请求
import { userGetInfoService } from '@/api/user'

// 获取pinia仓库 --- 得到userInfo数据
import { useUserStore } from '@/stores'
const userStore = useUserStore()

// 导入路由函数
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

// 设置菜单高亮
const activeMenu = ref(route.path)

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  }
)

// 在框架渲染时进行数据请求
onMounted(async () => {
    // 进行数据请求 --- 得到用户表单数据
    const res = await userGetInfoService()
    // console.log(res)
    const { data: { data } } = res
    // console.log(data)
    // 设置pinia中的表单数据
    userStore.setUserInfo(data)
})

// 点击中英文切换
const languageToggle = () => {
    language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}

// 设置下拉菜单的点击事件 --- 路由跳转
const router = useRouter()

// 退出登录弹出框控制器
const centerDialogVisible = ref(false)

const handleCommand = (command) => {
    // 有很多链接 --- 但当真的点到了 --- “退出登录”
    if (command === 'Loginout') {
        // 先询问是否退出登录
        centerDialogVisible.value = true
        return
    }
    router.push(command)
}
// 真正的退出按钮
const logOut = () => {
    userStore.removeToken()
    userStore.setUserInfo({})
    router.push('/login')
    ElMessage.success('退出登录成功')
}


</script>

<template>
    <!-- 整体框架 -->
    <el-container class="category-container">
        <!-- 左侧导航栏 -->
        <el-aside width="250px">
            <!-- 分级导航条 -->
            <div class="aside-menu">
                <el-menu
                    active-text-color="#ffd04b"
                    background-color="rgb(35, 35, 35)"
                    class="el-menu-vertical-demo"
                    :default-active="activeMenu"
                    router
                    text-color="#fff"
                >
                    <!-- 文章分类 -->
                    <el-menu-item index="/article/category">
                        <el-icon><Management /></el-icon>
                        <span>文章分类</span>
                    </el-menu-item>
                    <!-- 文章管理 -->
                    <el-menu-item index="/article/manage">
                        <el-icon><Promotion /></el-icon>
                        <span>文章管理</span>
                    </el-menu-item>
                    <!-- 个人中心 -->
                    <el-sub-menu index="/user">
                        <template #title>
                            <el-icon><UserFilled /></el-icon>
                            <span>个人中心</span>
                        </template>
                            <el-menu-item index="/user/profile">
                                <el-icon><User /></el-icon>
                                <span>基本资料</span>
                            </el-menu-item>
                            <el-menu-item index ="/user/avatar">
                                <el-icon><Crop /></el-icon>
                                <span>更换头像</span>
                            </el-menu-item>
                            <el-menu-item index="/user/password">
                                <el-icon><EditPen /></el-icon>
                                <span>重置密码</span>
                            </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>
        </el-aside>
        <!-- 右侧主体栏 -->
        <el-container class="right-body">
            <!-- 右侧头部 -->
            <el-header>
                <!-- 头部左侧 --- 名字信息 -->
                <div class="head-left">
                    <span>前端程序员：</span>
                    <span class="username">{{ userStore.userInfo.nickname || userStore.userInfo.username }}</span>
                </div>
                <!-- 头部右侧 --- 中英文切换 & 头像 -->
                <div class="head-right">
                    <!-- 中英文切换 -->
                    <div class="languageToggle">
                        <svg @click="languageToggle" t="1752288796725" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2521" data-spm-anchor-id="a313x.search_index.0.i2.413b3a81I7ZeHT" width="200" height="200">
                            <path d="M938.666667 981.333333c-17.066667 0-29.866667-8.533333-38.4-25.6l-59.733334-119.466666h-277.333333l-59.733333 119.466666c-8.533333 21.333333-34.133333 29.866667-55.466667 17.066667-25.6-8.533333-34.133333-34.133333-21.333333-51.2l72.533333-140.8 145.066667-290.133333c12.8-21.333333 34.133333-38.4 59.733333-38.4s46.933333 12.8 59.733333 38.4l145.066667 290.133333 72.533333 140.8c8.533333 21.333333 0 46.933333-17.066666 55.466667-12.8 4.266667-17.066667 4.266667-25.6 4.266666z m-332.8-226.133333h192l-98.133334-192-93.866666 192zM85.333333 844.8c-17.066667 0-29.866667-8.533333-38.4-25.6-8.533333-21.333333 0-46.933333 21.333334-55.466667 93.866667-46.933333 179.2-110.933333 247.466666-187.733333-46.933333-64-85.333333-128-110.933333-192-8.533333-21.333333 4.266667-46.933333 25.6-55.466667 21.333333-8.533333 46.933333 4.266667 55.466667 25.6 21.333333 51.2 46.933333 102.4 81.066666 149.333334 59.733333-85.333333 102.4-179.2 128-281.6H85.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h243.2V85.333333c0-25.6 17.066667-42.666667 42.666667-42.666666s42.666667 17.066667 42.666667 42.666666v51.2h238.933333c25.6 0 42.666667 17.066667 42.666667 42.666667s-17.066667 42.666667-42.666667 42.666667h-68.266667c-25.6 128-85.333333 247.466667-162.133333 349.866666l25.6 25.6c17.066667 17.066667 17.066667 42.666667 0 59.733334-17.066667 17.066667-42.666667 17.066667-59.733333 0l-17.066667-17.066667c-72.533333 81.066667-162.133333 149.333333-264.533333 200.533333-8.533333 0-17.066667 4.266667-21.333334 4.266667z" fill="#2c2c2c" p-id="2522" />
                        </svg>
                    </div>
                    <!-- 下拉菜单框 -->
                    <el-dropdown @command="handleCommand">
                        <!-- 头像 & 下拉标 -->
                        <div class="el-dropdown-link">
                            <el-avatar :size="50" :src="userStore.userInfo.user_pic || imgsrc" />
                            <el-icon class="el-icon--right"><CaretBottom /></el-icon>
                         </div>
                         <!-- 下拉框内容 -->
                         <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="/user/profile">
                                    <el-icon><User /></el-icon>
                                    <span>基本资料</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="/user/avatar">
                                    <el-icon><Crop /></el-icon>
                                    <span>更换头像</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="/user/password">
                                    <el-icon><EditPen /></el-icon>
                                    <span>重置密码</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="Loginout">
                                    <el-icon><SwitchButton /></el-icon>
                                    <span>退出登录</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            <!-- 右侧身体 -->
            <el-main>
                <div class="right-body-main">
                    <!-- 导入中英文配置选项 -->
                    <el-config-provider :locale="locale">
                        <!-- 导入组件页面 -->
                        <router-view></router-view>
                    </el-config-provider>
                </div>
            </el-main>
            <!-- 右侧脚部 -->
            <el-footer>大事件 ©2025 Created by 吴腾宗</el-footer>
        </el-container>
    </el-container>

    <!-- 退出弹框 -->
    <el-dialog
        v-model="centerDialogVisible"
        title="温馨提示"
        width="500"
        align-center
    >
        <p>
            <el-icon color="rgb(230, 162, 60)" size="25"><Warning /></el-icon>
            <span>您确定退出大事件吗？</span>
        </p>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="logOut">
                确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
*{
    box-sizing: border-box;
}
.category-container{
    width: 100%;
    height: 100vh;
    // 左侧导航栏
    .el-aside{
        background: rgb(35, 35, 35) url('@/assets/logo.png') no-repeat top / 120px auto;
        background-position-y: 5%;
        // 导航菜单主体
        .aside-menu{
            margin-top: 150px;
            width: 100%;
            .el-menu{
                width: 100%;
                .el-menu-item{
                    margin-bottom: 16x;
                }
            }
        }
    }
    // 右侧主体栏
    .right-body{
        width: 100%;
        background-color: rgb(245, 245, 245);
        // 右侧头顶栏
        .el-header{
            // background-color: pink;
            height: 100px;
            font-size: 17px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            // 头顶左边 --- 昵称
            .head-left{
                .username{
                    font-size: 20px;
                    font-weight: bolder;
                }
            }
            // 头顶右边 --- 头像
            .head-right {
                display: flex;
                justify-content: space-between;
                // background-color: skyblue;
                width: 120px;
                height: 100px;
                border: 0;
                .languageToggle{
                    // background-color: red;
                    svg{
                        width: 30px;
                        height: 100px;
                    }
                }
                .el-dropdown{
                    // width: 100%;
                    .el-dropdown-link{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        // 角标
                        .el-icon--right{
                            font-size: 20px;
                            font-weight: bold;
                        }

                        &:active,
                        &:focus {
                            outline: none;
                        }
                    }
                }

            }
            
        }
        // 右侧中间主体栏
        .el-main{
            padding: 15px 15px 0;
            .right-body-main{
                width: 100%;
                height: 100%;
                border-radius: 20px;
                background-color: skyblue;
                box-sizing: border-box;
            }
        }
        // 右侧脚部
        .el-footer{
            height: 100px;
            line-height: 100px;
            font-size: 20px;
            text-align: center;
            background-color: rgb(245, 245, 245);
            // background-color: red;
        }
    }
}

// 弹出框样式
.el-dialog{
    p{
        margin: 0;
        font-size: 16px;
        height: 30px;
        // background-color: pink;
        display: flex;
        align-items: center;
        justify-content: start;
        span,
        .el-icon{
            margin-left: 10px;
        }
    }
}
</style>