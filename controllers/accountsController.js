/**
 * AccountsController.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */

'use strict'

const User = require('../models/User')

const accountsController = {}

/**
 * Returns a HTML form for create a new account.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
accountsController.register = async (req, res) => {
  try {
    res.render('accounts/register')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}
/**
 * Creates a new user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
accountsController.registerPost = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })

    const dubbel = await User.findOne({ username: req.body.username })

    if (dubbel) {
      req.session.flash = { type: 'danger', text: 'Username aldready exists. Choose another.' }
      res.redirect('/accounts/register')
    } else {
      await user.save()

      req.session.flash = { type: 'success', text: 'Your account was successfully created' }
      res.redirect('/snippets/new')
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./register')
  }
}

/**
 * Returns a HTML form for login.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
accountsController.login = async (req, res) => {
  if (!req.session.login) {
    res.render('accounts/login')
  } else {
    req.session.flash = { type: 'success', text: 'You were successfully logged out' }
    req.session.destroy()
    res.redirect('/')
  }
}

/**
 * User authenticate login.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
accountsController.loginPost = async (req, res) => {
  try {
    await User.authenticate(req.body.username, req.body.password)
    req.session.regenerate(() => {
    })

    req.session.username = req.body.username
    req.session.flash = { type: 'success', text: req.body.username + ' was successfully logged in' }
    req.session.login = true
    res.redirect('/snippets/new')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./login')
  }
}

// Exports
module.exports = accountsController
