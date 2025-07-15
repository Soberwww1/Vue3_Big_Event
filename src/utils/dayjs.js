import { dayjs } from "element-plus"

// 使用dayjs插件 --- 将日期字符串格式化（其实我也没搞懂）

export const dayjsFormat = (time) => {
    return dayjs(time).format('YYYY年MM月DD日')
}