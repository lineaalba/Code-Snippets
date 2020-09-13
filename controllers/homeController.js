/**
 * HomeController.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */

'use strict'

const homeController = {}

/**
 * Displys start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
homeController.index = (req, res) => { res.render('home/index') }

/**
 * Create GET.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
homeController.login = async (req, res, next) => {
  try {
    res.render('home/login')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/')
  }
}

// // Exports
module.exports = homeController
