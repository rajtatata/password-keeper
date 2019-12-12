var express = require('express')
var router = express.Router()

const { add, deleteItem, getAll, update } = require('../controller/item')

router.get('/', getAll)
router.post('/', add)
router.delete('/:itemId', deleteItem)
router.put('/:itemId', update)

module.exports = router