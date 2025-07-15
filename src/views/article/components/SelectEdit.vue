<script setup>
import { ref } from 'vue'

// 导入文章分类API
import { articleGetCategoryList } from '@/api/article'

/*
    定义选择器数据 --- 注意：这个数据并不是选择器的数据，而是选择器选项的数据
    el-option通过提交不同的value数据，进而让el-select的显示值更改，但是el-select的显示值不可乱改
    因为select显示值的更改 --- 对应着下面表格中数据的渲染，所以select的显示值的 “控制权” 必须在 ArticleManage.ue组件中
    所以，使用 props --- emit 编译器宏进行父子组件通信，并使用:modelValue（相当于Vue2的value属性，就是与输入框值相关的属性）与select显示值产生关联
    建立update:modelValue事件监听，当值更改后进行组件通信 --- emit('xxx', xxx)。（我发现了一点，select中，点击哪个传入的event事件对象就是点击的那个option的value属性值）
*/
const options = ref([])

// 获取父组件传来的props
defineProps({
    modelValue: {
        type: [Number, String]
    }
})
// 给父组件传值
const emit = defineEmits(['update:modelValue'])

// 当监听到选择器值更改 --- 就触发的回调函数
const handleSubmit = (event) => {
    emit('update:modelValue', event)
}

// 定义函数在页面渲染时获取数据
const getArticleCategoryList = async () => {
    const res = await articleGetCategoryList()
    options.value = res.data.data
}

// 获取数据 --- 文章分类列表
getArticleCategoryList()
</script>

<template>
    <el-form-item label="文章分类：">
        <el-select
        style="width: 100%"
        :modelValue="modelValue"
        @update:modelValue="handleSubmit"
        >
            <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
            />
        </el-select>
    </el-form-item>
</template>

<style lang="less" scoped>
.el-form-item{
    min-width: 100%;
}
</style>