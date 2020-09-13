/**
 * Mongoose model Snippet.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')

// Create a schema.
const snippetSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true,
    minlength: [3, 'The snippet must be minimum 3 characters long']
  }
}, {
  timestamps: true
})

// Create a model using the schema.
const Snippet = mongoose.model('Snippet', snippetSchema)

// Exports.
module.exports = Snippet
