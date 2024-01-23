const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const userAuth = require('../otherFunctions/userAuth')

// Custom Modules
const UserSchema = require('../schemas/User')
const TeacherSchema = require('../schemas/Teacher')
const StudentSchema = require('../schemas/Student')
const AttendanceSchema = require('../schemas/Attendance')

// /api ====DONE====
router.get('/', async (req, res) => {
  res.status(200).json({ success: true, message: `API Route Working!`, timestamp: Date.now() })
})

// /api/register POST ====DONE====
router.post('/register', async (req, res) => {
  const { fullname, email, password, type, typeid, secret } = req.body

  // Validating User Details
  if (!fullname) return res.json({ success: false, error: 'no_fullname' })
  if (!email) return res.json({ success: false, error: 'no_email' })
  if (!password) return res.json({ success: false, error: 'no_password' })
  if (!type) return res.json({ success: false, error: 'no_type' })
  if (!typeid) return res.json({ success: false, error: 'no_typeid' })
  if (!secret) return res.json({ success: false, error: 'no_secret' })

  if (fullname.length < 1) return res.json({ success: false, error: 'no_fullname' })
  if (email.length < 1) return res.json({ success: false, error: 'no_email' })
  if (password.length < 8) return res.json({ success: false, error: 'no_password' })
  if (!(type == 'student' || type == 'teacher')) return res.json({ success: false, error: 'wrong_type' })
  if (typeid.length < 1) return res.json({ success: false, error: 'no_typeid' })
  if (secret !== process.env.USER_REGISTER_SECRET) return res.json({ success: false, error: 'wrong_secret' })

  // Checking if User already Exists
  let UserData = await UserSchema.findOne({ emailId: email })
  if (UserData) return res.json({ success: false, error: 'user_already_exists' })

  // Creating New Teacher User
  if(type == 'teacher'){
    var newUserData = await new UserSchema({
      fullName: fullname,
      emailId: email,
      password: jwt.sign({ password: password }, process.env.PASSWORD_HASH_SECRET),
      teacherId: typeid
    })
  }
  // Creating New Student User
  if(type == 'student'){
    var newUserData = await new UserSchema({
      fullName: fullname,
      emailId: email,
      password: jwt.sign({ password: password }, process.env.PASSWORD_HASH_SECRET),
      studentId: typeid
    })
  }
  
  // Saving Data to Database
  await newUserData.save().catch(err => {
    return res.json({ success: false, error: 'mongodb_error' })
  })

  res.json({ success: true, data: newUserData })
})

// /api/login POST ====DONE====
router.post('/login', userAuth.isLoggedOut, async (req, res) => {
  const { email, password } = req.body

  // Validating Login Details
  if (!email) return res.json({ success: false, error: 'no_email' })
  if (!password) return res.json({ success: false, error: 'no_password' })

  if (email.length < 1) return res.json({ success: false, error: 'no_email' })
  if (password.length < 1) return res.json({ success: false, error: 'no_password' })

  // Checking if User Exists
  let UserData = await UserSchema.findOne({ emailId: email })
  if(!UserData) return res.json({ success: false, error: 'user_not_found' })

  // Verifying Password
  try {
    var passwordVerify = jwt.verify(UserData.password, process.env.PASSWORD_HASH_SECRET)
  } catch(err) {
    return res.json({ success: false, error: 'wrong_password_jwt_error' })
  }
  if (passwordVerify.password != password) return res.json({ success: false, error: 'wrong_password' })

  // Generating JWT Token
  const token = jwt.sign({
    fullName: UserData.fullName,
    emailId: UserData.emailId,
    teacherId: UserData.teacherId,
    studentId: UserData.studentId,
  }, process.env.JWT_TOKEN_SECRET)

  // Returning JWT Token - User Logged In
  res.json({ success: true, token: token, data: {
    fullName: UserData.fullName,
    emailId: UserData.emailId,
    type: UserData.teacherId===null ? 'student' : 'teacher',
    typeId: UserData.teacherId===null ? UserData.studentId : UserData.teacherId
  } })
})

// /api/register-teacher POST ====DONE====
router.post('/register-teacher', async (req, res) => {
  const { secret, teacherId, subjectId, classList, hotspotSSID } = req.body
  if (!secret) return res.json({ success: false, error: 'no_secret' })
  if (!teacherId) return res.json({ success: false, error: 'no_teacherId' })
  if (!subjectId) return res.json({ success: false, error: 'no_subjectId' })
  if (!classList) return res.json({ success: false, error: 'no_classList' })
  if (!hotspotSSID) return res.json({ success: false, error: 'no_hotspotSSID' })
  
  if (classList.length<1) return res.json({ success: false, error: 'no_classList' })
  if (secret !== process.env.USER_REGISTER_SECRET) return res.json({ success: false, error: 'wrong_secret' })

  let TeacherData = await TeacherSchema.findOne({ teacherId })
  if(TeacherData) return res.json({ success: false, error: 'teacher_already_exists' })
  let newTeacherData = await new TeacherSchema({
    teacherId,
    subjectId,
    hotspotSSID,
    classIdList: classList.split(',')
  })
  await newTeacherData.save().catch(err => {
    return res.json({ success: false, error: 'mongodb_error' })
  })

  res.json({ success: true, data: newTeacherData })
})

// /api/register-student POST ====DONE====
router.post('/register-student', async (req, res) => {
  const { secret, studentId, classId, subjectList } = req.body
  if (!secret) return res.json({ success: false, error: 'no_secret' })
  if (!studentId) return res.json({ success: false, error: 'no_studentId' })
  if (!subjectList) return res.json({ success: false, error: 'no_subjectList' })
  if (!classId) return res.json({ success: false, error: 'no_classId' })

  if (subjectList.length<1) return res.json({ success: false, error: 'no_subjectList' })
  if (secret !== process.env.USER_REGISTER_SECRET) return res.json({ success: false, error: 'wrong_secret' })

  let StudentData = await StudentSchema.findOne({ studentId })
  if(StudentData) return res.json({ success: false, error: 'student_already_exists' })
  let newStudentData = await new StudentSchema({
    studentId,
    classId,
    subjectIdList: subjectList.split(',')
  })
  await newStudentData.save().catch(err => {
    return res.json({ success: false, error: 'mongodb_error' })
  })

  res.json({ success: true, data: newStudentData })
})

// /api/register-attendance POST ====DONE====
router.post('/register-attendance', async (req, res) => {
  const { attendanceDate, subjectId, classId, teacherId, presentStudentIdList, secret } = req.body
  if (!attendanceDate) return res.json({ success: false, error: 'no_attendanceDate' })
  if (!subjectId) return res.json({ success: false, error: 'no_subjectId' })
  if (!classId) return res.json({ success: false, error: 'no_classId' })
  if (!teacherId) return res.json({ success: false, error: 'no_teacherId' })
  if (!presentStudentIdList) return res.json({ success: false, error: 'no_presentStudentIdList' })
  if (!secret) return res.json({ success: false, error: 'no_secret' })

  if (presentStudentIdList.length<1) return res.json({ success: false, error: 'no_presentStudentIdList' })
  if (secret !== process.env.USER_REGISTER_SECRET) return res.json({ success: false, error: 'wrong_secret' })

  let AttendanceData = await AttendanceSchema.findOne({ attendanceDate, subjectId, classId, teacherId })
  if(AttendanceData) return res.json({ success: false, error: 'attendance_already_exists' })

  let newAttendanceData = await new AttendanceSchema({
    attendanceDate,
    classId,
    subjectId,
    teacherId,
    presentStudentIdList: presentStudentIdList.split(',')
  })
  await newAttendanceData.save().catch(err => {
    return res.json({ success: false, error: 'mongodb_error' })
  })

  res.json({ success: true, data: newAttendanceData })
})

// /api/class-student-list POST ====DONE====
router.post('/class-student-list', async (req, res) => {
  const { classId, secret } = req.body

  if (!classId) return res.json({ success: false, error: 'no_classId' })
  if (!secret) return res.json({ success: false, error: 'no_secret' })

  if (secret !== process.env.USER_REGISTER_SECRET) return res.json({ success: false, error: 'wrong_secret' })

  let StudentData = await StudentSchema.find({ classId }, { studentId: 1 })
  if(!StudentData) return res.json({ success: false, error: 'no_student_found' })

  res.json({ success: true, data: StudentData })
})

module.exports = router
