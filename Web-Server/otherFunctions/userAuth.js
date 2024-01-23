const jwt = require('jsonwebtoken')

module.exports.isTeacher = async (req, res, next) => {
  // Getting Bearer Authorization Header
  const bearerHeader = req.headers['authorization']
  // If Bearer header not present
  if (typeof bearerHeader === 'undefined') return res.json({ success: false, error: 'no_token' })
  // Getting JWT Token from Bearer header
  const userToken = bearerHeader.split(' ')[1]
  // Verifying JWT Token
  try {
    var userData = jwt.verify(userToken, process.env.JWT_TOKEN_SECRET)
  } catch(err) {
    return res.json({ success: false, error: 'wrong_token' })
  }
  // If Conflicting Data Found - no studentId
  if(userData.teacherId === null) return res.json({ success: false, error: 'not_teacher' })
  // All Checks Passed - Success
  req.userToken = userToken
  req.userData = userData
  next()
}

module.exports.isStudent = async (req, res, next) => {
  // Getting Bearer Authorization Header
  const bearerHeader = req.headers['authorization']
  // If Bearer header not present
  if (typeof bearerHeader === 'undefined') return res.json({ success: false, error: 'no_token' })
  // Getting JWT Token from Bearer header
  const userToken = bearerHeader.split(' ')[1]
  // Verifying JWT Token
  try {
    var userData = jwt.verify(userToken, process.env.JWT_TOKEN_SECRET)
  } catch(err) {
    return res.json({ success: false, error: 'wrong_token' })
  }
  // If Conflicting Data Found - no studentId
  if(userData.studentId === null) return res.json({ success: false, error: 'not_student' })
  // All Checks Passed - Success
  req.userToken = userToken
  req.userData = userData
  next()
}

module.exports.isLoggedOut = async (req, res, next) => {
  // Getting Bearer Authorization Header
  const bearerHeader = req.headers['authorization']
  // If Bearer header not present
  if (typeof bearerHeader === 'undefined') return next()
  // Getting JWT Token from Bearer header
  const userToken = bearerHeader.split(' ')[1]
  // If JWT Token not present
  if (typeof userToken === 'undefined') return next()
  // If JWT Token found at last... Returning user_logged_in
  return res.json({ success: false, error: 'user_logged_in' })
}
