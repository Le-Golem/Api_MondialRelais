const express = require('express')

const check = require('../../middlewares/check')
const completion = require('../../middlewares/completion')
const hash = require('../../middlewares/hash')
const JStoXML = require('../../middlewares/JStoXML')


const {
    getData
} = require('./api.controller')

const router = express.Router();

router.route('/').post(check, completion, hash, JStoXML, getData)

module.exports = router