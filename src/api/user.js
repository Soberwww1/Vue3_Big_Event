import request from '@/utils/request'

// 自行封装 --- 登陆服务
export const userLoginSerive = (obj) => {
    const { username, password } = obj
    return request.post('/api/login', {
        username,
        password
    })
}

// 自行封装 --- 注册服务
export const userRegistService = (obj) => {
    const { username, password, repassword } = obj
    return request.post('/api/reg', {
        username,
        password,
        repassword
    })
}

// 获取用户基本信息
export const userGetInfoService = () => {
    return request.get('/my/userinfo')
}

// 更新用户头像
export const userUpdateAvatarService = (avatar) => {
    return request.patch('/my/update/avatar', {
        avatar
    })
}

// 更新用户密码
export const userUpdatePasswordService = (obj) => {
    const { old_pwd, new_pwd, re_pwd } = obj
    return request.patch('/my/updatepwd', {
        old_pwd,
        new_pwd,
        re_pwd
    })
}

// 更新用户基本资料
export const userUpdateInfoService = (obj) => {
    const { id, username, nickname, email, user_pic } = obj
    return request.put('/my/userinfo', {
        id,
        username,
        nickname,
        email,
        user_pic
    })
}