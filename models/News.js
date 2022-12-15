const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    thubmnail: {
        type: String,
        default: 'no-photo.jpg'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('News', newsSchema)