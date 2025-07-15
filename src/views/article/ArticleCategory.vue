<script setup>
// 导入图标
import { Edit,  Delete } from '@element-plus/icons-vue'

// 导入基本函数
import { onMounted, ref } from 'vue'

// 导入获取数据API & 删除文章分类API
import { articleGetCategoryList, articleDelCategoryList } from '@/api/article'

// 导入二次封装的Dialog弹框
import DialogEdit from '@/views/article/components/DialogEdit.vue'
import { ElMessage } from 'element-plus'

// 定义传给自定义组件的标题
const title = '文章分类'

// 定义表格缓冲开关
const loading = ref(false)

// 定义传给表格的数据
const tableData = ref([])

// 模板引用 --- 获取导入的Dialog组件
const dialog = ref(null)

// 定义数据请求函数 --- getCar=tegoryList
const getCategortList = async () => {
    const res = await articleGetCategoryList()
    // console.log(res)
    tableData.value = res.data.data
}

// “添加分类”按钮 --- 该功能与表格操作按钮 --- 编辑按钮功能大体一样
const addCateList = () => {
  loading.value = true
  dialog.value.exposeFn({}) // 添加分类 --- 传入空对象
  loading.value = false 
}

// 表格操作的按钮
// 编辑按钮
const handleEdit = (row) => {
  // 执行自定义通用小组件 --- DialogEdit的私有暴露方法 --- exposeFn
  dialog.value.exposeFn(row) // 编辑对象 --- 传入当前row（当前行数据对象）
}
// 删除按钮
const handleDelete = async (row) => {
    // 先判断是否真删 --- 让删除确认弹框弹出
    await ElMessageBox.confirm('您确认删除该文章信息吗？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
    loading.value = true
    // 删除数据
    await articleDelCategoryList(String(row.id))
    // 重新拉去后台数据 --- 更新界面
    await getCategortList()
    loading.value = false
    // 消息提示
    ElMessage.success('删除成功')
}

// 当监听到子组件的onsubmit事件时说明后台数据已经更改，界面应该更新了
const handleSubmit = () => {
    getCategortList()
}

// 在模板渲染好后进行数据请求
onMounted(() => {
    getCategortList()
})
</script>

<template>
    <!-- 引用自定义的通用组件 -->
    <PageContainer :title="title">
        <!-- 具名插槽 --- 引用组件的头部插槽 -->
        <template #head-button>
            <el-button class="head-button" @click="addCateList">添加分类</el-button>
        </template>
        <!-- 具名插槽 --- 引用组件的身体插槽 --- 表格本体 -->
        <template #content>
            <!-- 使用elementPLUS的table组件 -->
            <el-table :data="tableData" v-loading="loading">
                <el-table-column type="index" label="序号" width="110"/>
                <el-table-column prop="cate_name" label="分类名称"/>
                <el-table-column prop="cate_alias" label="分类别名"/>
                <el-table-column class="content-handle" label="操作" width="150">
                    <template #default="scoped">
                        <el-button @click="handleEdit(scoped.row)" plain type="primary" circle>
                            <el-icon size="20"><Edit /></el-icon>
                        </el-button>
                        <el-button @click="handleDelete(scoped.row)" plain type="danger" circle>
                            <el-icon size="20"><Delete /></el-icon>
                        </el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="No Data" />
                </template>
            </el-table>
        </template>
    </PageContainer>

    <!-- 导入二次封装的弹框组件 -->
    <DialogEdit ref="dialog" @onsubmit="handleSubmit"></DialogEdit>
</template>

<style lang="less" scoped>
.head-button{
    background-color: rgb(64, 158, 255);
    border: 0;
    color: white;
    font-size: 16px;
}

// 主体表格
.el-table{
    width: 100%;
    .el-table-column{
        height: 100px;
    }
}

</style>