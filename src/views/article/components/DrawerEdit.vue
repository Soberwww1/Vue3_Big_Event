<script setup>
import { ref, onBeforeUnmount, shallowRef, defineExpose } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import SelectEdit from '@/views/article/components/SelectEdit.vue'

// 导入获取文章详情 & 发布文章 & 更新文章 API & 项目基地址
import { articleGetArticle, articlePublishArticle, articleUpdateArticle, baseURL } from '@/api/article'

// 导入将js对象转化为我formdata对象的API
import { objectToFormData } from '@/utils/objTofd'
// 导入将网络图片地址转化为file对象的API
import { imgUrlToFile } from '@/utils/imgUrlToFile'

import '@wangeditor/editor/dist/css/style.css' // 引入导入包 --- 富文本编辑器的css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'

// 给父元素发送通知 --- 成功更改/发布 文章 通知
const emit = defineEmits(['sucess'])

// 表单进行数据核验必需的ref
const formRef = ref(null)

// 默认数据 --- 在编辑文章完成后应该将form.value文件清空
// 表单提交数据
const defaultForm = ref({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
})

// 表单提交数据
const form = ref({})
form.value = { ...defaultForm.value }

// 表单核验规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题名', trigger: 'blur' },
    { pattern: /^\S{1,30}$/, message: '文章标题长度为1-30个字符', trigger: 'blur' }
  ],
  cate_id: [
    { required: true, message: '请选择文章分类', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

// 抽屉开关
const drawer = ref(false)

// 文件上传时的图片预览src
const imgUrl = ref('')

// 文件状态改变时的操作
const handleAvatarChange = (uploadFile) => {
  // 上传图片进行本地预览（不上传到服务器，等到最后提交时和其他表单数据一起提交）
  // 将图片对象赋值给要提交的表单数据中的 cover_img 文章封面
  form.value.cover_img = uploadFile.raw
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
}

// 设置发布函数
const articlePublish = async (obj) => {
  // 提交的数据要是form-data格式
  const tempdata = objectToFormData(obj)
  // console.log(tempdata)
  await articlePublishArticle(tempdata)
}
// 设置更新函数
const articleUpdate = async (obj) => {
  // 提交的数据要是form-data格式
  const tempdata = objectToFormData(obj)
  // console.log(tempdata)
  await articleUpdateArticle(tempdata)
}

// 设置暴露函数
const openFn = async (obj) => {
  drawer.value = true
  // console.log(obj)
  // 查看传递过来的对象有无id --- 有就是编辑；无就是发布文章
  if (obj.id) {
    form.value.id = obj.id
    // 获取文章页详情
    const { data: { data } } = await articleGetArticle(obj.id)
    // console.log(data)
    // 将获取的详情页数据赋值给form.value
    form.value = { ...data }
    // 让图片上传部分进行 “图片回显”
    imgUrl.value = baseURL + data.cover_img
    // 这里应该让 img.url 网络图片地址转化为file对象，然后又赋值给form.value.cover_img属性
    const file =  await imgUrlToFile(data.cover_img, form.value.cover_img)
    // console.log(file)
    form.value.cover_img = file
    // console.log(form.value)
  }
}

// 表单关闭时的回调函数
const onClosed = () => {
  // 重置表单
  form.value = defaultForm.value
  imgUrl.value = ''
}

// 发布/草稿按钮（注意提交前检验）
const onPublish = async (value) => {
  // 将文章状态传递给form
  form.value.state = value
  // console.log(form.value)
  // 进行预校验
  await formRef.value.validate()
  if (!imgUrl.value) {
    ElMessage.warning('请上传图片')
    return
  }
  // 没有ID --- 发布文章 --- （到最新的页面）
  if (!form.value.id) {
    articlePublish(form.value)
  } else { // 有ID就是编辑（保持原页面）
    articleUpdate(form.value)
  }
  drawer.value = false
  onClosed()
  // 给父元素发送成功更新请求
  emit('sucess')
}

// 暴露给父组件
defineExpose({
  openFn
})

// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// mode
const mode = ref('simple')

const toolbarConfig = {}
toolbarConfig.excludeKeys = [
  'headerSelect',
  'italic',
  'group-more-style', // 排除菜单组，写菜单组 key 的值即可
]

const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}


</script>
<template>
    <!-- 抽屉组件 -->
    <el-drawer size="50%" v-model="drawer" @closed="onClosed">
        <template #header>
            <h2>添加文章</h2>
        </template>
        <template #default>
            <!-- 抽屉页中的表单 -->
            <el-form
              :model="form"
              ref="formRef"
              :rules="rules"
            >
                <!-- 文章标题 -->
                <el-form-item
                  label="文章标题:"
                  prop="title"
                >
                    <el-input
                      v-model="form.title"
                      placeholder="请输入标题"
                    />
                </el-form-item>
                <!-- 文章分类 -->
                <el-form-item prop="cate_id">
                  <SelectEdit v-model="form.cate_id"></SelectEdit>
                </el-form-item>
                <!-- 图片上传 -->
                <el-form-item label="文章封面：">
                    <!-- 图片上传 -->
                    <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="handleAvatarChange"
                    >
                        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <!-- 文章内容 -->
                <el-form-item label="文章内容" prop="content">
                    <div style="border: 1px solid #ccc">
                      <Toolbar
                          style="border-bottom: 1px solid #ccc"
                          :editor="editorRef"
                          :defaultConfig="toolbarConfig"
                          :mode="mode"
                      />
                      <Editor
                          style="height: 500px; overflow-y: hidden;"
                          v-model="form.content"
                          :defaultConfig="editorConfig"
                          :mode="mode"
                          @onCreated="handleCreated"
                      />
                    </div>
                </el-form-item>
                <!-- 提交按钮 -->
                <el-form-item>
                  <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
                  <el-button @click="onPublish('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </template>
    </el-drawer>
</template>

<style lang="less" scoped>

// 上传图片样式 
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 2px dashed rgb(192, 196, 204);
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  /* transition: var(--el-transition-duration-fast); */
}

.avatar-uploader .el-upload:hover {
  border-color: rgb(64, 158, 255);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>