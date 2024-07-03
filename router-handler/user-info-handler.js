const db = require('../db');

function getUserInfo(req, res) {
    // 根据req.auth 中存储的id查询数据库， 返回用户信息
    // 注意： 密码排除
    console.log('user info in req auth===>', req.auth)
    const queryStr = 'SELECT id, username, status FROM user_table WHERE id=?'
    db.query(queryStr, req.auth.id, (err, response) => {
        if (err) return res.cc(err);
        if (response?.length === 0) return res.cc('user does not exist')
        res.send({
            message: 'get user info success',
            success: true,
            data: response[0]
        })
    })
}

function updateUserInfo(req, res) {
    const updatedUserInfo = req.body;
    const updateSql = 'UPDATE user_table SET username, nickname, email WHERE id=?';

    db.query(updateSql, [updatedUserInfo.username, updatedUserInfo.nickname, updatedUserInfo.email, updatedUserInfo.id], (err, response) => {
        if (err) return res.cc(err);
        if (response?.affectedRows === 0) return res.cc('user does not exist')
        res.send({
            message: 'update user info success',
            success: true
        })
    })
}

module.exports = { getUserInfo, updateUserInfo }