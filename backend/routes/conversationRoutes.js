const express = require('express')
const router = express.Router()
const {getConversation, getTwoConversation, newConversation  } = require("../controllers/conversationController")
const {protect} = require('../middleware/authMiddleware')

//twetter/conversations
router.post('/', protect , newConversation)

router.get('/:userId', protect, getConversation)
router.get('/find/:firstUserId/:secondUserId', protect, getTwoConversation)

module.exports = router;