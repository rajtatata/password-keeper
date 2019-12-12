const admin = require("firebase-admin")

admin.initializeApp()
const firestore = admin.firestore()

module.exports = (req, res, next) => {
    // add db connection to req
    req.firestore = firestore
    return next()
}