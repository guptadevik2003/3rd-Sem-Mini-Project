const { Schema, model } = require('mongoose')

const CurrentSchema = new Schema({

    attendanceDate: {
        type: Date,
    },
    subjectId: {
        type: String,
    },
    classId: {
        type: String,
    },
    teacherId: {
        type: String,
    },
    hotspotSSID: {
        type: String,
    },
    presentStudentIdList: {
        type: Array,
        default: [],
    },

}, { timestamps: true })

module.exports = model('Current', CurrentSchema, 'Currents')
