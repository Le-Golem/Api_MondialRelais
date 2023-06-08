const express = require('express')

const check = require('../../middlewares/check')

const {
    getData
} = require('./api.controller')

const router = express.Router();

router.route('/').post(check , getData)

module.exports = router