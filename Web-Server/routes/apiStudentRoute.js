const express = require('express')
const router = express.Router()

// Custom Modules
const StudentSchema = require('../schemas/Student')
const CurrentSchema = require('../schemas/Current')
const AttendanceSchema = require('../schemas/Attendance')
const TeacherSchema = require('../schemas/Teacher')
const UserSchema = require('../schemas/User')

// /api/student ====DONE====
router.get('/', async (req, res) => {
  res.status(200).json({ success: true, message: `Student API Route Working!`, timestamp: Date.now() })
})

// /api/student/info ====DONE====
router.get('/info', async (req, res) => {
  const { userData } = req
  
  let studentData = await StudentSchema.findOne({ studentId: userData.studentId })
  if(!studentData) return res.json({ success: false, error: 'student_not_found' })

  res.json({ success: true, data: studentData })
})

// /api/student/mark-attendance POST ====DONE====
router.post('/mark-attendance', async (req, res) => {
  const { studentId, classId, subjectId, hotspotSSIDList } = req.body

  if(!classId) return res.json({ success: false, error: 'no_classId' })
  if(!subjectId) return res.json({ success: false, error: 'no_subjectId' })
  if(!studentId) return res.json({ success: false, error: 'no_studentId' })
  if(!hotspotSSIDList) return res.json({ success: false, error: 'no_hotspotSSIDList' })

  if(hotspotSSIDList.length<1) return res.json({ success: false, error: 'no_hotspotSSIDList' })

  let CurrentData = await CurrentSchema.findOne({ classId, subjectId })
  if(!CurrentData) return res.json({ success: false, error: 'current_attendance_not_found' })

  if(!hotspotSSIDList.includes(CurrentData.hotspotSSID)) return res.json({ success: false, error: 'wifi_not_in_range' })

  if(CurrentData.presentStudentIdList.includes(studentId)) return res.json({ success: false, error: 'attendance_already_updated' })

  CurrentData.presentStudentIdList.push(studentId)

  const newCurrentData = await CurrentSchema.findOneAndUpdate({ classId, subjectId }, {
    presentStudentIdList: CurrentData.presentStudentIdList
  })

  res.json({ success: true , data: newCurrentData })
})

// /api/student/get-teacher-subject POST ====DONE====
router.post('/get-teacher-subject', async (req, res) => {
  const { subjectId } = req.body

  if(!subjectId) return res.json({ success: false, error: 'no_subjectId' })

  let TeacherData = await TeacherSchema.findOne({ subjectId }, { teacherId: 1 })
  if(!TeacherData) return res.json({ success: false, error: 'teacher_not_found' })

  let UserData = await UserSchema.findOne({ teacherId: TeacherData.teacherId }, { fullName: 1 })
  if(!UserData) return res.json({ success: false, error: 'teacher_user_not_found' })

  res.json({ success: true, data: { teacherId: TeacherData.teacherId, fullName: UserData.fullName } })
})

// /api/student/get-attendance-info POST ====DONE====
router.post('/get-attendance-info', async (req, res) => {
  const { classId, subjectId } = req.body

  if(!classId) return res.json({ success: false, error: 'no_classId' })
  if(!subjectId) return res.json({ success: false, error: 'no_subjectId' })

  let AttendanceData = await AttendanceSchema.find({ classId, subjectId }, { attendanceDate: 1, presentStudentIdList: 1 })
  if(!AttendanceData || AttendanceData.length<1) return res.json({ success: false, error: 'no_attendance_found' })

  res.json({ success: true, data: AttendanceData })
})

module.exports = router
