const express = require('express')
const router = express.Router()
const { getAllTweets, getTweetsFromFollowing, getMyTweets ,commentTweet
     ,updateTweet, updateLikeTweet, createTweet, deleteTweet } = require("../controllers/tweetController")
const {protect} = require('../middleware/authMiddleware')

//tweet routes
//twetter/home
router.get('/', getAllTweets)
router.get('/feed', protect , getTweetsFromFollowing) 
router.get('/mytweets', protect , getMyTweets)
router.post('/create', protect, createTweet)
router.put('/comment', protect, commentTweet)
router.put('/:id', protect, updateTweet)
router.put('/likes/tweet', protect, updateLikeTweet)
router.delete('/profile/delete/:id', protect, deleteTweet)

/* router.put('/:id/comment', protect, commentOnTweet) */

module.exports = router