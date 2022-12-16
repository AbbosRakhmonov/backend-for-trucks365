const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/AsyncHandler')
const News = require('../models/News')
const path = require('path')

// @desc      Get news
// @route     GET /api/v1/news/:id
// @access    Public
exports.getAllNews = asyncHandler(async (req, res, next) => {
    const data = await News.find({})
    res.status(200).json({
        success: true,
        data
    })
})

// @desc      Get news
// @route     GET /api/v1/news/:id
// @access    Public
exports.getNews = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const data = await News.findById(id).select('content')
    res.status(200).json({
        success: true,
        data
    })
})

// @desc      Create news
// @route     POST /api/v1/news/
// @access    Private
exports.createNews = asyncHandler(async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const {title, content} = req.body
    if (!req.file) {
        return next(new ErrorResponse(`Please upload a file`, 400))
    }
    const file = req.file

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        )
    }
    const news = await News.create({
            title,
            content,
            thubmnail: url + '/public/uploads/' + file.filename
        }
    )
    res.status(200).json({
        success: true,
        data: news
    })
})

// @desc      Delete news
// @route     POST /api/v1/news/:id
// @access    Private
exports.deleteNews = asyncHandler(async (req, res, next) => {
    const {id} = req.params

    const news = await News.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        data: {}
    })
})

// @desc      Update news
// @route     PUT /api/v1/news/:id
// @access    Private
exports.updateNews = asyncHandler(async (req, res, next) => {
    const {id} = req.params

    const news = await News.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: news
    })

})





