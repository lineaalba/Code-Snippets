/**
 * SnippetsRouter.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/snippetsController')

// GET, POST
router.get('/', controller.index)

router.get('/new', controller.new)
router.post('/create', controller.create)

router.get('/:id/edit', controller.edit)
router.post('/:id/update', controller.update)

router.get('/:id/remove', controller.remove)

// Exports
module.exports = router
