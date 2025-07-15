import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// import { useUserStore } from '@/stores/modules/user'
// export { useUserStore }

// 在stores模块中，有很多仓库，假如说要在组件中一个一个导入，很麻烦，还能容易写错，
// 所以可以先将所有的仓库导入到index，再在组件中直接导入 index就可以

// 进阶语法（更简单）：
// export * from '@/stores/modules/user'
// 意思是，将user仓库中所有能导出的全部导入到index中，然后再在index导出（说白了就是这一句代码相当于上面两句代码）
export * from '@/stores/modules/user'