const express = require('express')
const router = express.Router()

// Custom Modules


// / ====DONE====
router.get('/', async (req, res) => {
  res.status(200).json({ success: true, message: `Home Page`, timestamp: Date.now() })
})
router.get('/home', async (req, res) => {
    res.redirect('/')
})
router.get('/index', async (req, res) => {
    res.redirect('/')
})

module.exports = router
