const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/jwt');

function register(req, res) {
    const user = req.body;
    // if (!user.username || !user.password) {
    //     return res.send('username or password can not be null');
    // } 
    const quertStr1 = 'SELECT * FROM user_table WHERE username=?'
    db.query(quertStr1, user.username, (err, data) => {
        if (err) {
            console.log('register user fail, error: ' + err);
            return res.cc(err)
        }
        else if (data && data.length > 0) {
            console.log('user name already exixted');
            return res.cc('username is already existed')
        } else {
            // use bcrypt to encrypt the user password
            user.password = bcrypt.hashSync(user.password, 15);
            console.log('encypted password is ', user.password);
            const insertStr = 'INSERT INTO user_table SET ?';
            db.query(insertStr, { username: user.username, password: user.password }, (err, data) => {
                if (err) {
                    console.log('register user fail, error: ' + err);
                    return res.cc(err)
                }

                if (data.affectedRows !== 1) {
                    console.log('register user fail');
                    return res.cc('register user fail')
                }

                console.log('register user success');
                res.send({message: 'register user success', success: true})
            })
        }
    })
}


function login(req, res) {
    const user = req.body;
    // if (!user.username || !user.password) {
    //     return res.cc('username or password can not be null');
    // }
    const queryStr = 'SELECT * FROM user_table WHERE username=?';
    db.query(queryStr, user.username, (err, data) => {
        // SQL语句执行错误
        if (err) {
            console.log('user login fail , error: ' + err);
            return res.cc('login user fail')
        }
        // SQL语句执行成功， 但是没有匹配数据
        if (data?.length === 0) {
            console.log('user does not exist, please go to register new user');
            return res.cc('user does not exit');
        }
        // 用bcrypt.compareSync 验证用户登录密码
        const same = bcrypt.compareSync(user.password, data[0].password)
        if(!same) {
            return res.cc('username or password is wrong')
        }
        const encryptedUserInfo = { ...data[0], password: ''};
        const jwtToken = jwt.sign(encryptedUserInfo, secretKey, { expiresIn: '6h'});
        res.send({
            message:'login success', 
            success: true ,
            username: user.username,
            authToken: `Bearer ${jwtToken}`
        })

    })

}

module.exports = { register, login };