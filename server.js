const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const errorHandler = require('./middleware/ErrorHandler')
const connectDB = require('./config/db')

// Load env vars
dotenv.config({path: './config/config.env'})

const app = express()
app.use(cors())

// Body parser
app.use(express.json())

// Route files
const Auth = require('./routes/auth')
const News = require('./routes/nws')

app.get('/', (req, res) => {
    res.send('Backend Worked')
})

// Mount routers
app.use('/api/v1/auth', Auth)
app.use('/api/v1/news', News)

// Connect DB
connectDB()

// file upload
app.use(fileUpload({
    createParentPath: true
}))

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Error handler
app.use(errorHandler)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// server
const PORT = process.env.PORT || 5000

try {
    const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))
} catch (err) {
    console.error(`Error occurred: ${err.message}`)
}
