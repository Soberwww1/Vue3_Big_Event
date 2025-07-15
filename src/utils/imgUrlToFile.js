import axios from "axios"


// 新建一个实例 --- 为了这盘醋（下面的imgurl转换file对象）包了这顿饺子（创建个axios实例）😂😂😂🤣我真实傻逼
const tempaxios = axios.create({
    baseURL: 'http://big-event-vue-api-t.itheima.net/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

export const imgUrlToFile = async (url, fileName) => {
    try {
        // 使用 Axios 下载图片数据
        const response = await tempaxios.get(url, { responseType: 'arraybuffer' })
        // 将下载的数据转换成 Blob 对象
        const blob = new Blob([response.data], {
          type: response.headers['content-type']
        })
        // 创建 File 对象
        const file = new File([blob], fileName, {
          type: response.headers['content-type']
        })
        return file
      } catch (error) {
        console.error(error)
        return null
      }
}