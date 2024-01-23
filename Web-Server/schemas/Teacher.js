const { Schema, model } = require('mongoose')

const TeacherSchema = new Schema({

    teacherId: {
      type: String,
    },
    subjectId: {
        type: String,
    },
    hotspotSSID: {
        type: String,
    },
    classIdList: {
        type: Array,
    },

}, { timestamps: true })

module.exports = model('Teacher', TeacherSchema, 'Teachers')
