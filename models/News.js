const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjVMQh3Pawxel1-2LVOcA-CH8KbIyEEbjaEXDOPn3TkA&s'
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