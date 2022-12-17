const {Router} = require('express')
const crypto = require('crypto')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const router = Router()
const News = require('../models/News')

// DB

// connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// init gfs
let gfs
conn.once('open', () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    })
})

// Storage
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                }
                resolve(fileInfo)
            })
        })
    }
})
//const storage = new GridFsStorage({ url: mongoURI }) // soddaroq usuli

const upload = multer({
    storage
})

// route'lar
router.get('/', (req, res) => {
    if (!gfs) {
        const error = 'Kutilmagan xato yuz berdi.'
        res.status(500).json({error: error})
        process.exit(0)
    }
    gfs.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.status(500).json({error: 'Fayllar mavjud emas!'})
        } else {
            const f = files
                .map((file) => {
                    if (
                        file.contentType === 'image/png' ||
                        file.contentType === 'image/jpeg'
                    ) {
                        file.isImage = true
                    } else {
                        file.isImage = false
                    }
                    return file
                })
                .sort((a, b) => {
                    return (
                        new Date(b['uploadDate']).getTime() -
                        new Date(a['uploadDate']).getTime()
                    )
                })

            return res.send({files: f})
        }
        // return res.json(files)
    })
})

router.post('/:newsId', upload.single('file'), (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const {newsId} = req.params
    const news = News.findByIdAndUpdate(newsId, {
        thumbnail: (url + '/' + 'api/v1/upload/file/' + req.file.filename)
    })

    res.json({
        success: true,
        data: news
    })
})

router.get('/files', (req, res) => {
    gfs.find().toArray((err, files) => {
        // fayl mavjudligini tekshiramiz
        if (!files || files.length === 0) {
            return res.status(404).json({
                error: 'Fayllar mavjud emas!'
            })
        }
        return res.json(files)
    })
})

router.get('/file', (req, res) => {
    const file = gfs
        .find({
            filename: req.body.filename
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    error: 'Fayl mavjud emas!'
                })
            }
            gfs.openDownloadStreamByName(req.body.filename).pipe(res)
        })
})

router.get('/file/:filename', (req, res) => {
    const file = gfs
        .find({
            filename: req.params.filename
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    error: 'Fayllar mavjud emas!'
                })
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res)
        })
})

// files/del/:id
// faylni database'dan o'chiramiz
router.post('/del', (req, res) => {
    gfs
        .find({
            filename: req.body.filename
        })
        .toArray((err, files) => {
            // fayl mavjudligini tekshiramiz
            if (err) {
                return res.status(404).json({
                    error: 'Fayl mavjud emas!'
                })
            }

            if (!files || files.length === 0) {
                return res.status(404).json({
                    error: 'Fayl mavjud emas!'
                })
            }

            let file = files[0]
            gfs.delete(new mongoose.Types.ObjectId(file._id), (err, data) => {
                if (err)
                    return res
                        .status(404)
                        .json({error: 'Ushbu fayl tizimdan mavjud emas!'})

                res.json({accept: 'Fayl muvaffqqiyatli o\'chirildi!'})
            })
        })
})

module.exports = router