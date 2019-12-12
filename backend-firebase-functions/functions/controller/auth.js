const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { parseUser } = require('../util/dataParsers')
const { firestoreRead, firestoreWrite, firestoreUpdate, firestoreDelete } = require('../util/dbUtils')
const { randomString } = require('../util/random')
const { sendEmail, passwordResetHTML } = require('../util/email')

exports.login = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })

    const { username, password } = req.body

    const valid = schema.validate({ username, password, })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    let u = await firestoreRead(req.firestore, 'users', username)
    if (!u.exists) {
        return res.status(400).send({
            status: 0,
            message: `User ${username} does not exist!`,
        })
    }

    const user = parseUser(u.data()) // parse user data

    if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username, email: user.email }, process.env.TOKEN_SECRET, {
            expiresIn: '1h'
        })

        return res.status(200).send({
            status: 1,
            token
        })
    } else {
        return res.status(400).send({
            status: 0,
            message: `Wrong password!`,
        })
    }
}

exports.register = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().allow('')
    })

    const { username, password, email } = req.body

    const valid = schema.validate({ username, password, email })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    // check username exists
    let u = await firestoreRead(req.firestore, 'users', username)
    if (u.exists) {
        return res.status(400).send({
            status: 0,
            message: `User ${username} already exist!`,
        })
    }

    await firestoreWrite(req.firestore, 'users', username, { username, email: email || '', password: bcrypt.hashSync(password, 12) })

    return res.status(200).send({
        status: 1,
        message: `User ${username} created successfully`
    })
}

exports.updateEmail = async (req, res) => {
    if (!req.isAuth) {
        return res.status(400).send({
            status: 0,
            message: "Not authenticated"
        })
    }

    const schema = Joi.object({
        email: Joi.string().email().allow('').required()
    })

    const { email } = req.body

    const valid = schema.validate({ email })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    await firestoreUpdate(req.firestore, 'users', req.username, { email })
    const token = jwt.sign({ username: req.username, email }, process.env.TOKEN_SECRET, {
        expiresIn: '1h'
    })

    return res.status(200).send({
        status: 1,
        token
    })
}

exports.forgotPass = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    })

    const { email } = req.body

    const valid = schema.validate({ email })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    // check if user exists
    let u = await req.firestore.collection("users").where("email", "==", email).get()

    if (u.empty) {
        return res.status(400).send({
            status: 0,
            message: `Email ${email} does not exist!`,
        })
    }

    let flagExit = false
    u.forEach(async user => {
        if (flagExit) return

        // update the user passwordResetToken
        const username = user.id
        const passwordResetToken = randomString()
        await firestoreUpdate(req.firestore, 'users', username, { passwordResetToken })

        // send this token through email
        sendEmail(email, "Password Keeper: Reset password", passwordResetHTML(passwordResetToken))

        flagExit = true
    })

    return res.status(200).send({
        status: 1
    })
}

exports.resetPass = async (req, res) => {
    const schema = Joi.object({
        passwordResetToken: Joi.string().required(),
        newPassword: Joi.string().required()
    })

    const { passwordResetToken, newPassword } = req.body

    const valid = schema.validate({ passwordResetToken, newPassword })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    // check if user exists
    let u = await req.firestore.collection("users").where("passwordResetToken", "==", passwordResetToken).get()
    if (u.empty) {
        return res.status(400).send({
            status: 0,
            message: `Wrong reset token!`,
        })
    }

    let flagExit = false
    u.forEach(async user => {
        if (flagExit) return
        // delete the user passwordResetToken and reset the password
        const username = user.id
        await firestoreUpdate(req.firestore, 'users', username, { passwordResetToken: null, password: bcrypt.hashSync(newPassword, 12) })

        flagExit = true
    })

    return res.status(200).send({
        status: 1
    })
}

exports.changePass = async (req, res) => {
    if (!req.isAuth) {
        return res.status(400).send({
            status: 0,
            message: "Not authenticated"
        })
    }

    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    })

    const { oldPassword, newPassword } = req.body

    const valid = schema.validate({ oldPassword, newPassword })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    let u = await firestoreRead(req.firestore, 'users', req.username)
    if (!u.exists) {
        return res.status(400).send({
            status: 0,
            message: `User ${req.username} does not exist!`,
        })
    }

    const user = parseUser(u.data()) // parse user data

    if (bcrypt.compareSync(oldPassword, user.password)) {
        await firestoreUpdate(req.firestore, 'users', req.username, { password: bcrypt.hashSync(newPassword, 12) })

        return res.status(200).send({
            status: 1
        })
    } else {
        return res.status(400).send({
            status: 0,
            message: `Wrong old password!`,
        })
    }
}

exports.deleteAccount = async (req, res) => {
    if (!req.isAuth) {
        return res.status(400).send({
            status: 0,
            message: "Not authenticated"
        })
    }

    const items = await req.firestore.collection("items").where("username", "==", req.username).get()
    items.forEach(async doc => {
        await doc.ref.delete()
    })

    await firestoreDelete(req.firestore, 'users', req.username)

    return res.status(200).send({
        status: 1,
    })
}