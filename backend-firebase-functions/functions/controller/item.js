const Joi = require('@hapi/joi')

const { parseItem } = require('../util/dataParsers')
const { firestoreRead, firestoreWrite, firestoreUpdate, firestoreDelete } = require('../util/dbUtils')


exports.add = async (req, res) => {
    if (!req.isAuth) {
        return res.status(400).send({
            status: 0,
            message: "Not authenticated"
        })
    }

    const schema = Joi.object({
        description: Joi.string().required(),
        encryptedPass: Joi.string().required(),
        nonce: Joi.string().required()
    })

    const { description, encryptedPass, nonce } = req.body

    const valid = schema.validate({ description, encryptedPass, nonce })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    const item = await firestoreWrite(req.firestore, 'items', null, { description, encryptedPass, nonce, username: req.username })

    return res.status(200).send({
        status: 1,
        item: {
            id: item.id,
            description,
            encryptedPass,
            nonce,
            username: req.username
        },
        message: "Item saved successfully"
    })
}

exports.deleteItem = async (req, res) => {
    if (!req.isAuth) {
        return res.status(400).send({
            status: 0,
            message: "Not authenticated"
        })
    }

    const schema = Joi.object({
        itemId: Joi.string().required()
    })

    const { itemId } = req.params

    const valid = schema.validate({ itemId })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    if (! await validateItemUsername(req, itemId)) {
        return res.status(400).send({
            status: 0,
            message: "Forbidden"
        })
    }

    await firestoreDelete(req.firestore, 'items', itemId)

    return res.status(200).send({
        status: 1,
        message: "Item deleted successfully"
    })
}

exports.update = async (req, res) => {
    if (!req.isAuth) {
        return res.status(400).send({
            status: 0,
            message: "Not authenticated"
        })
    }

    const schema = Joi.object({
        itemId: Joi.string().required(),
        description: Joi.string().required(),
        encryptedPass: Joi.string().required(),
        nonce: Joi.string().required()
    })

    const { description, encryptedPass, nonce } = req.body
    const { itemId } = req.params

    const valid = schema.validate({ description, encryptedPass, nonce, itemId })

    // request validation
    if (valid.error) {
        return res.status(400).send({
            status: 0,
            message: valid.error.message,
        })
    }

    if (! await validateItemUsername(req, itemId)) {
        return res.status(400).send({
            status: 0,
            message: "Forbidden"
        })
    }

    await firestoreUpdate(req.firestore, 'items', itemId, { description, encryptedPass, nonce })

    return res.status(200).send({
        status: 1,
        message: "Item updated successfully"
    })
}

exports.getAll = async (req, res) => {
    if (!req.isAuth) {
        return res.status(400).send({
            status: 0,
            message: "Not authenticated"
        })
    }

    const items = await req.firestore.collection("items").where("username", "==", req.username).get()

    const itemsArray = []

    if (!items.empty) {
        items.forEach(t => {
            itemsArray.push({
                ...t.data(),
                id: t.id
            })
        })
    }

    return res.status(200).send({
        status: 1,
        items: itemsArray
    })
}

const validateItemUsername = async (req, id) => {
    let i = await firestoreRead(req.firestore, 'items', id)

    if (!i.exists) {
        return false
    }

    let item = parseItem(i.data()) // parse item data

    // validate username
    if (item.username !== req.username) {
        return false
    }
    return true
}