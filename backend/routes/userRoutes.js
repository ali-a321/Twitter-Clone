const express = require('express')
const router = express.Router()
const { registerUser, getMe, loginUser, updateCoverPic, updateProfilePic,
     followPerson, unfollowPerson, getUserProfile, searchUserProfile,searchUser,
      updateBio , updateFirstName, verifyUser} = require("../controllers/userController")
const {protect} = require('../middleware/authMiddleware')

///twetter/users/...
router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/profile/:id', protect, getUserProfile)
router.get('/searchuser', protect, searchUserProfile)

router.post('/search', protect, searchUser)
router.put('/uploadcoverpicture', protect, updateCoverPic)
router.put('/uploadprofilepicture', protect, updateProfilePic)
router.put('/changebio', protect, updateBio)
router.put('/changefirstname', protect, updateFirstName)
router.put('/verifyuser', protect, verifyUser )

router.put('/follow', followPerson)
router.put('/unfollow', unfollowPerson)


module.exports = router