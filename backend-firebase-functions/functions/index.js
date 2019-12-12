const functions = require('firebase-functions')
const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')

const isAuth = require('./middleware/isAuth')
const firestore = require('./middleware/firestore')

const authRouter = require('./router/auth')
const itemRouter = require('./router/item')

dotenv.config()

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())
app.use(isAuth)
app.use(firestore)

app.use('/auth', authRouter)
app.use('/item', itemRouter)

exports.api = functions.https.onRequest(app)
