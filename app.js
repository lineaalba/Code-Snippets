/**
 * The starting point of the application.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */
'use strict'

require('dotenv').config()

const createError = require('http-errors')

const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const { join } = require('path')
const logger = require('morgan')
const helmet = require('helmet')

const mongoose = require('./config/mongoose')

const app = express()

app.use(helmet())

// Connect to the database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// additional middlewares
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, 'public')))

// setup and use session middleware
const sessionOptions = {
  name: 'Express application',
  secret: 'Student',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'lax'
  }
}

app.use(session(sessionOptions))

// middleware to be executed before the routes
app.use((req, res, next) => {
  // flash messages - survives only a round trip
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  if (req.session.username) {
    res.locals.username = req.session.username
  }

  if (req.session.autherID) {
    res.locals.autherID = req.session.autherID
  }

  next()
})

// routes
app.use('/accounts', require('./routes/accountsRouter'))
app.use('/snippets', require('./routes/snippetsRouter'))
app.use('/', require('./routes/homeRouter'))
app.use('/*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .sendFile(join(__dirname, 'views', 'errors', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(join(__dirname, 'views', 'errors', '500.html'))
  }

  // Development only!
  // Only providing detailed error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
})

// listening
app.listen(8000, () => console.log('Server running'))
