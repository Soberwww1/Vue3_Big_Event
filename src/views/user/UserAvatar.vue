<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
// 导入更新用户基本资料的API
import { userUpdateAvatarService } from '@/api/user'

// 获取pinia仓库 --- 得到userInfo数据
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const loading = ref(false)
const title = '更换头像'

// 模板引用
const uploadRef = ref(null)
// 将头像base64格式对象先赋值给imgUrl --- 让头像图片回显
const imgUrl = ref(userStore.userInfo.user_pic)
// console.log(imgUrl.value)

// 在upload组件状态改变时就会触发的回调
const handleAvatarChange = (uploadFile) => {
    // 将file对象转化为base64格式
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw)
    reader.onload = () => {
        // 将新头像base64格式对象赋值给imgUrl.value
        imgUrl.value = reader.result
    }
}

// 上传头像
const uploadImg = async () => {
    loading.value = true
    await userUpdateAvatarService(imgUrl.value)
    // 更新pinia仓库中的值
    userStore.userInfo.user_pic = imgUrl.value
    loading.value = false
    ElMessage.success('头像改变成功')
}

</script>

<template>
    <PageContainer :title="title">
        <template #content>
            <el-row>
                <el-col :span="20">
                    <el-form>
                        <el-form-item>
                            <el-upload
                                v-loading="loading"
                                ref="uploadRef"
                                class="avatar-uploader"
                                :auto-upload="false"
                                :show-file-list="false"
                                :on-change="handleAvatarChange"
                            >
                                <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                            </el-upload>
                        </el-form-item>
                        <!-- 按钮 -->
                        <el-form-item>
                            <el-button @click="uploadRef.$el.querySelector('input').click()" type="primary"><el-icon><Plus /></el-icon>选择图片</el-button>
                            <el-button @click="uploadImg" type="success"><el-icon><Upload /></el-icon>上传头像</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </template>
    </PageContainer>
</template>

<style lang="less" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
