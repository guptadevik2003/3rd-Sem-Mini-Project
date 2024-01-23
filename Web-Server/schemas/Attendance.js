const { Schema, model } = require('mongoose')

const AttendanceSchema = new Schema({

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
    presentStudentIdList: {
        type: Array,
    },

}, { timestamps: true })

module.exports = model('Attendance', AttendanceSchema, 'Attendances')
