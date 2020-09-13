/**
 * AccountsRouter.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/accountsController')

// GET, POST
router.get('/register', controller.register)
router.post('/registerPost', controller.registerPost)

router.get('/login', controller.login)
router.post('/loginPost', controller.loginPost)

// Exports
module.exports = router
