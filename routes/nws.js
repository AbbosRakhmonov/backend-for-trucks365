const path = require('path')
const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/Auth')
const {getNews, createNews, updateNews, deleteNews, getAllNews} = require('../controller/news')


router.route('/').post(protect, createNews).get(getAllNews)
router.route('/:id').put(protect, updateNews).delete(protect, deleteNews).get(getNews)

module.exports = router