<script setup>
defineProps({
    title: {
        required: true,
        type: String
    }
})
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="card-header">
                <span>{{ title }}</span>
                <slot name="head-button"></slot>
            </div>
        </template>
        <!-- 默认插槽出口（自定义的） --- 里面存放要放的东西 -->
        <slot name="content"></slot>
    </el-card>
</template>

<style lang="less" scoped>
.page-container{
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    border-radius: 20px;
    .card-header{
        min-height: 65px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
    }

}
</style>