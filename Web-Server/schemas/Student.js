const { Schema, model } = require('mongoose')

const StudentSchema = new Schema({

    studentId: {
      type: String,
    },
    classId: {
        type: String,
    },
    subjectIdList: {
        type: Array,
    },

}, { timestamps: true })

module.exports = model('Student', StudentSchema, 'Students')
