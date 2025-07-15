import request from '@/utils/request'

// 获取文章分类列表
export const articleGetCategoryList = () => {
    return request.get('/my/cate/list')
}
// 更新文章分类列表项
export const articleUpdateCategoryList = (obj) => {
    const { id, cate_name, cate_alias } = obj
    return request.put('/my/cate/info', {
        id,
        cate_name,
        cate_alias
    })
}
// 增加文章分类列表项
export const articleAddCategoryList = (data) => {
    return request.post('/my/cate/add', data)
}
// 删除文章分类列表项
export const articleDelCategoryList = (id) => {
    return request.delete('/my/cate/del', {
        params: {
            id
        }
    })
}

// 获取文章分类项详情
export const articleGetCategoryInfo = (id) => {
    return request.get('/my/cate/info', {
        params: {
            id
        }
    })
}

// 获取已发布文章列表
export const articleGetArticleList = (obj) => {
    // const { pagenum, pagesize, cate_id, state } = obj
    return request.get('/my/article/list', {
        params: {...obj}
    })
}

// 发布新文章
export const articlePublishArticle = (obj) => {
    return request.post('/my/article/add', obj)
}

// 删除文章
export const articleRemoveArticle = (id) => {
    return request.delete('/my/article/info', {
        params: {
            id
        }
    })
}

// 获取文章详情
export const articleGetArticle = (id) => {
    return request.get('/my/article/info', {
        params: {
            id
        }
    })
}

// 更新文章详情
export const articleUpdateArticle = (obj) => {
    return request.put('/my/article/info', obj)
}

// 基地址
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
