const { Schema, model } = require('mongoose')

const UserSchema = new Schema({

    fullName: {
      type: String, 
    },
    emailId: {
      type: String,
    },
    password: {
      type: String,
    },
    teacherId: {
      type: String,
      default: null,
    },
    studentId: {
      type: String,
      default: null,
    },

}, { timestamps: true })

module.exports = model('User', UserSchema, 'Users')
