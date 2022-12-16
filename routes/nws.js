const path = require('path')
const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/Auth')
const {getNews, createNews, updateNews, deleteNews, getAllNews} = require('../controller/news')
const multer = require('multer')

function middleware(req, res, next) {
    let imageName
    let uploadStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads')
        },
        filename: function (req, file, cb) {
            imageName = file.originalname
            cb(null, imageName)
        }
    })

    let uploader = multer({storage: uploadStorage})

    let uploadFile = uploader.single('file')

    uploadFile(req, res, function (err) {
        req.imageName = imageName
        req.uploadError = err
        next()
    })
}

router.route('/').post(protect, middleware, createNews).get(getAllNews)
router.route('/:id').put(protect, updateNews).delete(protect, deleteNews).get(getNews)

module.exports = router