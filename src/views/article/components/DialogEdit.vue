<script setup>
import { ref, defineExpose } from 'vue'

// 导入数据请求API
import { articleAddCategoryList, articleUpdateCategoryList } from '@/api/article'
import { ElMessage } from 'element-plus'

// 子组件向父组件传递
const emit =  defineEmits(['onsubmit'])

// 定义弹出框标题
const title = ref('')

// 定义弹出框开关
const dialogVisible = ref(false)

// 获取表单模板
const formRef = ref(null)
// 表单数据
const form = ref({
    cate_name: '',
    cate_alias: ''
})
// 表单验证
const rules = {
    cate_name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { pattern: /^\S{1,10}$/, message: '分类名必须是 1-10 位的非空字符', trigger: 'blur' }
    ],
    cate_alias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
        { pattern: /^[0-9a-zA-Z]{1,15}$/, message: '分类名必须是 1-15 位的字母或数字', trigger: 'blur' }
    ]
}

// 暴露出去的函数 --- 接受父组件的数据
const exposeFn = (obj) => {
    // 打开弹框
    dialogVisible.value = true
    // 将对应按钮的数据传来
    form.value = obj
    // console.log((!obj) === true)
    // console.log(obj === true)
    // 判断传来的数据是否为空 --- 为何判断有无ID而不是判断非空，因为测试过发现既不是空也不是非空😓
    if (!form.value.id) {
        title.value = '添加分类'
    } else {
        title.value = '编辑分类'
    }
}
defineExpose({
    exposeFn
})

// 点击弹框确认键操作
const onSubmit = async () => {
    await formRef.value.validate()
    if (!form.value.id) {
        // 预校验
        // await formRef.value.validate()
        await articleAddCategoryList(form.value)
        ElMessage.success('添加成功')
    } else {
        // 预校验
        // await formRef.value.validate()
        await articleUpdateCategoryList(form.value)
        ElMessage.success('编辑成功')
    }
    // 让弹框消失
    dialogVisible.value = false
    // 让父组件更新
    emit('onsubmit')
}
</script>

<template>
    <!-- dialog --- 弹出框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="500"
    >
        <!-- 弹框内容 -->
        <el-form
            :model="form"
            ref="formRef"
            :rules="rules"
            style="padding: 0 10px;"
        >
            <!-- 第一个输入框 -->
            <el-form-item label="分类名称" prop="cate_name">
                <el-input v-model="form.cate_name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <!-- 第二个输入框 -->
            <el-form-item label="分类别名" prop="cate_alias">
                <el-input v-model="form.cate_alias" placeholder="请输入分类别名"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">
                确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>