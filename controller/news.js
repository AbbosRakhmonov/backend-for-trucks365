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
    const data = await News.findById(id)
    res.status(200).json({
        success: true,
        data
    })
})

// @desc      Create news
// @route     POST /api/v1/news/
// @access    Private
exports.createNews = asyncHandler(async (req, res, next) => {
    const {title, content} = req.body

    const news = await News.create({
            title,
            content,
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





