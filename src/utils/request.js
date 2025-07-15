import axios from 'axios'

// 下面存在提示，导入elementPLUS插件 --- message轻提示
import { ElMessage } from 'element-plus'

// 在组件外部js使用pinia仓库中数据
import { useUserStore } from '@/stores/index';

// 在组件外部js中使用VueRouter
import router from '@/router/index'
const instance = axios.create({
    baseURL: 'http://big-event-vue-api-t.itheima.net/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    const userStore = useUserStore()
    // 在发送请求之前做些什么
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对状态码具有要求
    // 对响应数据做点什么
    if (response.data.code === 0 || response.data.status === 0) {
      return response
    }
    ElMessage.error(response.data.message)
  }, function (error) {
    // 特殊错误 --- 401 --- 权限不足 或 Token过期（说白了就是未携带token发起请求）
    if (error.status === 401) {
      ElMessage('您登录出现问题，请重新登录')
      // 跳转登录页
      router.push('/login')
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    ElMessage.error(error.data.message || '服务异常')
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default instance