<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

import SelectEdit from '@/views/article/components/SelectEdit.vue' 
import DrawerEdit from './components/DrawerEdit.vue'
// 导入获取文章列表的API & 删除文章的API
import { articleGetArticleList, articleRemoveArticle } from '@/api/article'
import { dayjsFormat } from '@/utils/dayjs'
import { ElMessage } from 'element-plus'

// 标题内容 --- 传递给公共组件标题
const title = '文章管理'

// 请求参数
const parmasobj = ref({
    pagenum: 1, // 当前页码数
    pagesize: '5', // 当前页需要的数据条数
    cate_id: '', // 文章分类ID --- 直接绑定到“文章分类”选择器值
    state: '' // 文章状态 --- 直接绑定到“发布状态”选择器的值
})

// 分页框数据总数 --- total
const total = ref(0)

// 控制每页显示的数据数量 --- 因为必须要Number，而数据请求获取的数据时String --- 无奈进行赋值😓😓😓
const pagesize = ref(0)
pagesize.value = Number(parmasobj.value.pagesize)

// 设置右侧抽屉
const drawer = ref(null)

// 加载效果
const loading = ref(false)

// 表格数据
const tableData = ref([])

// 数据请求函数 --- 二次封装
const getArticleList = async () => {
    // 每当执行该函数 --- 必会数据请求 --- 添加一个加载效果
    loading.value = true
    const res = await articleGetArticleList(parmasobj.value)
    // console.log(res)
    tableData.value = res.data.data.reverse()
    // total是文章总数（可以控制下面分页框） --- 在获取数据时顺便获取了
    total.value = res.data.total
    loading.value = false
}

// 搜索键 --- 搜索对应文章
const searchData = () => {
    // 判断选择器中是否为空 --- 空就不允许搜索
    if (!parmasobj.value.cate_id && !parmasobj.value.state) {
        ElMessage.warning('请先选择分类数据再搜索')
        return
    }
    parmasobj.value.pagenum = 1
    getArticleList()
    
}

// 重置键 --- 重置搜索框数据
const reSet = () => {
    // 判断选择器是否都为空 --- 空就无需重置
    if (!parmasobj.value.cate_id && !parmasobj.value.state) {
        ElMessage.warning('无需重置')
        return
    }
    parmasobj.value.cate_id = ''
    parmasobj.value.state = ''
    parmasobj.value.pagenum = 1
    getArticleList()
}

// 表格中的操作 --- 删除项
const handleDelete = async (row) => {
    // console.log(row.id)
    await ElMessageBox.confirm('您确认删除吗', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
    await articleRemoveArticle(row.id)
    await getArticleList()
    ElMessage.success('删除成功')
}

// 表格中的操作 --- 编辑项 --- 打开右侧抽屉进行数据回显&更新
const handleEdit = (row) => {
    // console.log(row)
    drawer.value.openFn(row)
}

// 点击发布文章 --- 打开右侧抽屉
const openDrawer = () => {
    drawer.value.openFn({})
} 

// 分页框按钮 --- 控制当前页码 & 控制每页渲染条数
// 控制每页显示数据条数
const handleSizeChange = (value) => {
    parmasobj.value.pagesize = String(value)
    getArticleList()
}

// 控制当前页码数
const handleCurrentChange = (value) => {
    parmasobj.value.pagenum = value
    getArticleList()
}

// 页面一渲染就要进行数据请求
getArticleList()

// 当监听到rawerEdit组件更新（@sucess）时，更新页面，重新渲染
const onsucess = () => {
    getArticleList()
}



</script>
<template>
    <PageContainer :title="title">
        <template #head-button>
            <el-button @click="openDrawer" class="head-button">发布文章</el-button>
        </template>
        <!-- 自定义插槽身体 -->
        <template #content>
            <!-- 选择器 -->
            <div class="content-top">
                <el-form :inline="true">
                    <!-- 导入自定义组件 --- 文章分类选择框 -->
                    <!-- <SelectEdit :modelValue="id" @update:modelValue="temphandle"></SelectEdit> -->
                    <SelectEdit v-model="parmasobj.cate_id"></SelectEdit>
                    <el-form-item label="发布状态：">
                        <el-select v-model="parmasobj.state">
                            <el-option label="已发布" value="已发布" />
                            <el-option label="草稿" value="草稿" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="searchData" type="primary">搜索</el-button>
                        <el-button @click="reSet">重置</el-button>
                    </el-form-item>
                </el-form>            
            </div>
            <!-- 表格 -->
            <el-table :data="tableData" v-loading="loading">
                <!-- 文章标题 -->
                <el-table-column prop="title" label="文章标题" min-width="100">
                    <template #default="scope">
                        <el-link type="primary" underline="never">{{ scope.row.title }}</el-link>
                    </template>
                </el-table-column>
                <!-- 文章分类 -->
                <el-table-column prop="cate_name" label="分类"/>
                <!-- 文章发布时间 -->
                <el-table-column label="发布时间" min-width="100">
                    <template #default="scope">{{ dayjsFormat(scope.row.pub_date) }}</template>
                </el-table-column>
                <!-- 文章状态 -->
                <el-table-column prop="state" label="状态"/>
                <!-- 文章对应操作 -->
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
                <!-- 当数据为空时 --- 展示空 -->
                <template #empty>
                    <el-empty description="No Data" />
                </template>
            </el-table>
            <!-- 分页框 -->
            <div class="demo-pagination-block">
                <el-pagination
                v-model:current-page="parmasobj.pagenum"
                v-model:page-size="pagesize"
                :page-sizes="[2, 5, 10, 20]"
                :background="true"
                layout="jumper, total, sizes, prev, pager, next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                />
            </div>
            <!-- 右侧抽屉 --- 顺便将商品分类ID传给该子组件 -->
            <DrawerEdit ref="drawer" @sucess="onsucess"></DrawerEdit>
        </template>
    </PageContainer>

</template>

<style lang="less" scoped>
.head-button{
    background-color: rgb(64, 158, 255);
    border: 0;
    color: white;
    font-size: 16px;
}

// 选择器样式
.content-top{
    width: 100%;
    margin-bottom: 20px;
    .el-form{
        width: 100%;
        // background-color: pink;
        .el-form-item{
            min-width: 300px;
        }
    }
}
// 表格样式
.el-table{
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
}

// 分页框样式
.demo-pagination-block{
    // background-color: skyblue;
    .el-pagination{
        justify-content: center;
    }
}
</style>
  