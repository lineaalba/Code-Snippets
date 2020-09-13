/**
 * Mongoose model User.
 *
 * @author Filippa Jakobsson
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Create a schema.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'You need a username.'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'You need a password.'],
    minlength: [10, 'The password length must be minimum 10 characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  // If no user is found or the password is wrong, throw an error.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }

  // Return the authenticated user.
  return user
}

// Create a model using the schema.
const User = mongoose.model('User', userSchema)

// Exports.
module.exports = User
