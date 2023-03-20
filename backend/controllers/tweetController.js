const asyncHandler = require('express-async-handler')
const Tweet = require('../models/tweetModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')


const getAllTweets = asyncHandler(async (req,res) => {
  try {
    
    const tweets = await Tweet.find({}).sort({timestamp: -1})
                                      .populate("user", '-password')
                                      .populate("postedBy","-password")
                                      .populate("comments.postedBy","-password")

    let allTweets = tweets

    if (allTweets.length > 40) {
        allTweets = allTweets.slice(0, 40)
    }

    return res.status(200).json(allTweets)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

const getTweetsFromFollowing = asyncHandler(async (req,res) =>  {
  try {
    const currentUser = await User.findById(req.user.id)
    const posts = await Tweet.find({}).sort({timestamp: -1})
                              .populate("user", '-password')
                              .populate("postedBy","-password")
                              .populate("comments.postedBy","-password")
                              
    const currentUserPosts = await Tweet.find({ user: currentUser._id })
                                        .sort({timestamp: -1})
                                        .populate("user", '-password')
                                        .populate("postedBy","-password")
                                        .populate("comments.postedBy","-password")
    const friendsPosts = posts.filter((post) => {
        return currentUser.followings.includes(post.user._id)
    })

    let timelinePosts = friendsPosts.concat(...currentUserPosts)

    if (timelinePosts.length > 40) {
        timelinePosts = timelinePosts.slice(0, 40)
    }

    return res.status(200).json(timelinePosts)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
// Get my Tweets GET /twetter/home/mytweets
const getMyTweets = asyncHandler(async (req,res) => {
    const tweets = await Tweet.find({user: req.user.id}).sort({timestamp:-1})
                              .populate("user", '-password')
                              .populate("postedBy","-password")
                              .populate("comments.postedBy","-password")
                            
    res.status(200).json(tweets)
})


const createTweet = asyncHandler(async (req,res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.id)
    const newTweet = await Tweet.create({ ...req.body, user: userId })

    return res.status(201).json(newTweet)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
// Comment on a tweet, PUT /twetter/home/comment
const commentTweet = asyncHandler(async(req,res) => {
  const comment = {
    text:req.body.text,
    postedBy:req.user._id
}
Tweet.findByIdAndUpdate(req.body.tweetId,{
    $push:{comments:comment}
},{
    new:true
})
.populate("user", '-password')
.populate("postedBy","-password")
.populate("comments.postedBy","-password")
.exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }else{
        res.json(result)
    }
})
})
  

// Update Tweet, PUT /twetter/home/:id
const updateTweet = asyncHandler(async (req,res) => {
    const tweet = await Tweet.findById(req.params.id)
    if(!tweet){
        res.status(400)
        throw new Error("Tweet not found")
    }
 
    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }
    //Only author can update his own tweet
    
    if(tweet.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    
    const updatedTweet = await tweet.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(200).json(updatedTweet)
})
//Liked/dislike tweets, PUT /twetter/home/likes/tweet
const updateLikeTweet = asyncHandler(async (req,res) => {
    try {
      const tweet = await Tweet.findById(req.body.tweetId);
      if (!tweet.likes.includes(req.user._id)) {
        await tweet.updateOne({ $push: { likes: req.user._id } });
        res.status(200).json("The post has been liked");
      } else {
        await tweet.updateOne({ $pull: { likes: req.user._id } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
   
  /* comment on tweet,  PUT  /home/:id/comment
  const commentOnTweet = asyncHandler(async (req,res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
        await tweet.updateOne({ $push: { comments: req.body.comments } });
        res.status(200).json("Your first comment has been posted");
      
    } catch (err) {
      res.status(500).json(err);
    }
  });
*/

// delete Tweet, DELETE /twetter/home/profile/:id
const deleteTweet = asyncHandler(async (req,res) => {
    const tweet = await Tweet.findById(req.params.id)
    if(!tweet){
        res.status(400)
        throw new Error("Tweet not found")
    }
   
    //Check for user
    if(!req.user){
        res.status(401)
        throw new Error("User not found")
    }
    //Only author can delete his own tweet
    if(tweet.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    await tweet.remove()
    res.status(200).json({id: req.params.id})
})


module.exports = {getAllTweets, getTweetsFromFollowing, getMyTweets,createTweet,
   commentTweet, updateTweet, updateLikeTweet, deleteTweet }
