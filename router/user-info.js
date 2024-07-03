const express = require('express');
const router = express.Router();
const expressJoi = require('@escook/express-joi');
const { update_userinfo_schema } = require('../schema/user');

const userInfoHandler = require('../router-handler/user-info-handler');

router.get('/getUserInfo', userInfoHandler.getUserInfo);
router.post('/updateUserInfo', expressJoi(update_userinfo_schema), userInfoHandler.updateUserInfo)

module.exports = router;