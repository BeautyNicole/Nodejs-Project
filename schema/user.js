// 导入定义验证规则的包
const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(3).max(12).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

// 定义username, nickname, email 验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();

// 定义验证注册表单和登陆表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

exports.update_userinfo_schema = {
    id,
    nickname,
    email
}