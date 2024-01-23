const { Schema, model } = require('mongoose')

const ClassSchema = new Schema({

    classId: {
        type: String,
    },
    studentIdList: {
        type: Array,
    },

}, { timestamps: true })

module.exports = model('Class', ClassSchema, 'Classes')
