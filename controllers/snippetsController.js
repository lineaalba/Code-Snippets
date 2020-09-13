/**
 * SnippetsController.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */

'use strict'

const Snippet = require('../models/Snippet')

const snippetsController = {}

/**
 * Displays a list of snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetsController.index = async (req, res, next) => {
  try {
    const viewData = {
      snippets: (await Snippet.find({}))
        .map(snippet => ({
          id: snippet._id,
          author: snippet.author,
          snippet: snippet.snippet
        }))

    }

    res.render('snippets/index', { viewData })
  } catch (error) {
    next(error)
  }
}

/**
 * Returns a HTML form for creating a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetsController.new = async (req, res, next) => {
  try {
    if (req.session.login) {
      const username = req.session.username
      res.render('snippets/new', { username })
    } else {
      req.session.flash = { type: 'danger', text: 'Log in to create a snippet' }
      res.redirect('/accounts/login')
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('..')
  }
}

/**
 * Creates a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetsController.create = async (req, res, next) => {
  if (!req.session.login) {
    req.session.flash = { type: 'danger', text: 'Log in to create a snippet' }
    res.redirect('/accounts/login')
  } else {
    try {
      const snippet = new Snippet({
        snippet: req.body.snippet,
        author: req.body.author
      })
      await snippet.save()

      req.session.flash = { type: 'success', text: 'Snippet was created successfully' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('.')
    }
  }
}

/**
 * Returns a HTML form for editing a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.edit = async (req, res) => {
  try {
    if (req.session.login) {
      const snippet = await Snippet.findOne({ _id: req.params.id })
      if (snippet.author === req.session.username) {
        const viewData = {
          id: snippet._id,
          author: snippet.author,
          snippet: snippet
        }
        res.render('snippets/edit', { viewData })
      } else {
        req.session.flash = { type: 'danger', text: 'Not able to edit this snippet' }
        res.redirect('..')
      }
    } else {
      req.session.flash = { type: 'danger', text: 'You have to log in to edit your snippets' }
      res.redirect('/accounts/login')
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('..')
  }
}

/**
 * Updates a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.update = async (req, res) => {
  if (!req.session.login) {
    req.session.flash = { type: 'danger', text: 'You have to be logged in to update your snippets.' }
    res.redirect('/')
  } else {
    try {
      const snippet = await Snippet.findOne({ _id: req.params.id })
      if (snippet.author === req.session.username) {
        await Snippet.updateOne({ _id: req.params.id }, {
          snippet: req.body.snippet
        })

        req.session.flash = { type: 'success', text: 'The snippet was successfully updated.' }
        res.redirect('..')
      } else {
        req.session.flash = { type: 'danger', text: 'Not able to update this snippet.' }
        res.redirect('/')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/')
    }
  }
}

/**
 * Removes a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.remove = async (req, res) => {
  if (!req.session.login) {
    req.session.flash = { type: 'danger', text: 'You have to be logged in to delete your snippets.' }
    res.redirect('/')
  } else {
    try {
      const snippet = await Snippet.findOne({ _id: req.params.id })
      if (snippet.author === req.session.username) {
        await Snippet.deleteOne({ _id: req.params.id }, {
          snippet: req.body.snippet
        })

        req.session.flash = { type: 'success', text: 'The snippet was successfully deleted.' }
        res.redirect('..')
      } else {
        req.session.flash = { type: 'danger', text: 'Not able to delete this snippet.' }
        res.redirect('/')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/')
    }
  }
}

// Exports
module.exports = snippetsController
