const express = require('express')
const router = express.Router()

// Custom Modules
const TeacherSchema = require('../schemas/Teacher')
const CurrentSchema = require('../schemas/Current')
const AttendanceSchema = require('../schemas/Attendance')
const UserSchema = require('../schemas/User')
const StudentSchema = require('../schemas/Student')

// /api/teacher ====DONE====
router.get('/', async (req, res) => {
  res.status(200).json({ success: true, message: `Teacher API Route Working!`, timestamp: Date.now() })
})

// /api/teacher/info ====DONE====
router.get('/info', async (req, res) => {
  const { userData } = req
  
  let teacherData = await TeacherSchema.findOne({ teacherId: userData.teacherId })
  if(!teacherData) return res.json({ success: false, error: 'teacher_not_found' })

  res.json({ success: true, data: teacherData })
})

// /api/teacher/rename-hotspot POST ====DONE====
router.post('/rename-hotspot', async (req, res) => {
  const { teacherId, hotspotSSID } = req.body

  if(!teacherId) return res.json({ success: false, error: 'no_teacherId' })
  if(!hotspotSSID) return res.json({ success: false, error: 'no_hotspotSSID' })

  let teacherData = await TeacherSchema.findOne({ teacherId })
  if(!teacherData) return res.json({ success: false, error: 'teacher_not_found' })

  let newTeacherData = await TeacherSchema.findOneAndUpdate({ teacherId }, {
    hotspotSSID: hotspotSSID
  }).catch(err => {
    return res.json({ success: false, error: 'mongodb_error' })
  })

  res.json({ success: true, data: newTeacherData })
})

// /api/teacher/take-attendance POST ====DONE====
router.post('/take-attendance', async (req, res) => {
  const { classId, subjectId, teacherId, hotspotSSID } = req.body

  if(!classId) return res.json({ success: false, error: 'no_classId' })
  if(!subjectId) return res.json({ success: false, error: 'no_subjectId' })
  if(!teacherId) return res.json({ success: false, error: 'no_teacherId' })
  if(!hotspotSSID) return res.json({ success: false, error: 'no_hotspotSSID' })

  let CurrentData = await CurrentSchema.findOne({ classId, subjectId, teacherId })
  if(CurrentData){
    let timeDiff = Date.now() - CurrentData.attendanceDate
    if(timeDiff > 100 * 1000){
      await CurrentSchema.findOneAndDelete({ classId, subjectId, teacherId })
    } else {
      return res.json({ success: false, error: `already_started_wait_${Number(100-(timeDiff/1000)).toFixed(0)}_seconds` })
    }
  }
  let newCurrentData = await new CurrentSchema({
    attendanceDate: Date.now(),
    subjectId,
    classId,
    teacherId,
    hotspotSSID,
  })
  await newCurrentData.save().catch(err => {
    return res.json({ success: false, error: 'mongodb_error' })
  })

  res.json({ success: true, data: newCurrentData })
})

// /api/teacher/take-attendance/done POST ====DONE====
router.post('/take-attendance/done', async (req, res) => {
  const { classId, subjectId, teacherId } = req.body

  if(!classId) return res.json({ success: false, error: 'no_classId' })
  if(!subjectId) return res.json({ success: false, error: 'no_subjectId' })
  if(!teacherId) return res.json({ success: false, error: 'no_teacherId' })

  let CurrentData = await CurrentSchema.findOne({ classId, subjectId, teacherId })
  if(!CurrentData) return res.json({ success: false, error: 'no_current_attendance_found' })

  if(CurrentData.presentStudentIdList.length<1){
    await CurrentSchema.findOneAndDelete({ classId, subjectId, teacherId })
    return res.json({ success: true, exception: 'no_student_present' })
  }

  let newAttendanceData = await new AttendanceSchema({
    attendanceDate: CurrentData.attendanceDate,
    subjectId,
    classId,
    teacherId,
    presentStudentIdList: CurrentData.presentStudentIdList,
  })

  await newAttendanceData.save().catch(err => {
    return res.json({ success: false, error: 'mongodb_error' })
  })

  await CurrentSchema.findOneAndDelete({ classId, subjectId, teacherId })
  res.json({ success: true, message: 'deleted_current_attendance', data: newAttendanceData })
})

// /api/teacher/get-attendance-list POST ====DONE====
router.post('/get-attendance-list', async (req, res) => {
  const { classId, subjectId, teacherId } = req.body

  if(!classId) return res.json({ success: false, error: 'no_classId' })
  if(!subjectId) return res.json({ success: false, error: 'no_subjectId' })
  if(!teacherId) return res.json({ success: false, error: 'no_teacherId' })

  let AttendanceData = await AttendanceSchema.find({ classId, subjectId, teacherId }, { attendanceDate: 1 })
  if(!AttendanceData || AttendanceData.length<1) return res.json({ success: false, error: 'no_attendance_found' })

  res.json({ success: true, data: AttendanceData })
})

// /api/teacher/get-attendance-info POST ====DONE====
router.post('/get-attendance-info', async (req, res) => {
  const { id } = req.body

  if(!id) return res.json({ success: false, error: 'no_id' })

  let AttendanceData = await AttendanceSchema.findOne({ _id: id })
  if(!AttendanceData) return res.json({ success: false, error: 'no_attendance_found' })

  let ClassStudentList = await StudentSchema.find({ classId: AttendanceData.classId }, { studentId: 1 })
  if(!ClassStudentList || ClassStudentList.length<1) return res.json({ success: false, error: 'student_list_not_found' })

  let resultList = []

  await ClassStudentList.forEach(async (item, index) => {
    let EachStudent = await UserSchema.findOne({ studentId: item.studentId }, { fullName: 1 })
    await resultList.push([ item.studentId, EachStudent.fullName, AttendanceData.presentStudentIdList.includes(item.studentId) ? true : false ])
    if(ClassStudentList.length === resultList.length) return res.json({ success: true, data: { info: AttendanceData, list: resultList }  })
  })
})

module.exports = router
