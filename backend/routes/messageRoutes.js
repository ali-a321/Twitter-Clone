const express = require('express')
const router = express.Router()
const {getMessage, createMessage } = require("../controllers/messageController")
const {protect} = require('../middleware/authMiddleware')

//twetter/messages
router.post('/', protect , createMessage) 
router.get('/:conversationId', protect, getMessage)


module.exports = router;