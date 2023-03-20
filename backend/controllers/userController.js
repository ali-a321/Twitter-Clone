const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Tweet = require('../models/tweetModel')

//* REGISTER/LOGIN FIRST HALF OF FILE *//    FOLLOW INFO BOTTOM HALF//

// Register POST /twetter/users
const registerUser = asyncHandler(async (req,res) => {
    const {firstname, lastname, username, password} = req.body
    if (!firstname || !lastname || !username || !password){
        res.status(400)
        throw new Error('Please fill in the whole form')
    }
    //Check if user already created
    const userCheck = await User.findOne({username})
    if (userCheck){
        res.status(400)
        throw new Error("This username already exists")
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    //Create user
    const user = await User.create({firstname:firstname, 
        lastname:lastname, 
        username:username,
        password:hashedPassword})
    if (user){
        res.status(201).json({_id: user.id, 
            firstname: user.firstname, 
            lastname: user.lastname, 
            username: user.username,
            token: generateToken(user._id),
        })
    }else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})
// Login POST /twetter/users/login
const loginUser = asyncHandler(async (req,res) => {
    const {username, password} = req.body
    //Check for username
    const user = await User.findOne({username})
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({_id: user.id, 
            firstname: user.firstname, 
            lastname: user.lastname, 
            username: user.username,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid credentials")
    }  
})

// Login shown for each user(PRIVATE)  GET /twetter/users/me
const getMe = asyncHandler(async (req,res) => {
   
    res.status(200).json(req.user)

})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h',})
}
//Get other user profile, GET /twetter/users/profile/:id

const getUserProfile = asyncHandler(async (req,res) => {
  User.findOne({_id:req.params.id})
  .select("-password")
  .select("-lastname")
  .then(profile=>{
       Tweet.find({user:req.params.id})
       .sort({timestamp: -1})
       .populate("user", '-password')
       .populate("postedBy","-password")
       .populate("comments.postedBy","-password")
       .exec((err,tweets)=>{
           if(err){
               return res.status(422).json({error:err})
           }
           res.json({profile,tweets})
       })
  }).catch(err=>{
      return res.status(404).json({error:"User not found"})
  })
})
//POST, twetter/users/search
const searchUser = asyncHandler(async (req,res) => {
  if (req.body.query < 1){
    return null 
  }
  else if (req.body.query){
    let userPattern = new RegExp("^"+req.body.query)
    User.find({firstname:{$regex:userPattern}})
    .select("_id firstname username profilePicture")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
  }
})
//GET, twetter/users/searchuser
const searchUserProfile = asyncHandler(async (req,res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//FOLLOW INFO//

// PUT twetter/users/:id/follow

const followPerson =  asyncHandler(async (req,res) => {
    if (req.body.user !== req.body.followId) {
      try {
        const user = await User.findById(req.body.followId);
        const currentUser = await User.findById(req.body.user);
        if (!user.followers.includes(req.body.user)) {
          await user.updateOne({ $push: { followers: req.body.user } });
          await currentUser.updateOne({ $push: { followings: req.body.followId } });
          res.status(200).json("You are following the user!");
        } else {
          res.status(403).json("You already follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Sadly, you can't follow yourself.");
    }
  });

  
// PUT twetter/users/unfollow
const unfollowPerson = asyncHandler(async (req,res) => {
    if (req.body.user !== req.body.followId) {
    try {
      const user = await User.findById(req.body.followId);
      const currentUser = await User.findById(req.body.user);
      if (user.followers.includes(req.body.user)) {
        await user.updateOne({ $pull: { followers: req.body.user } });
        await currentUser.updateOne({ $pull: { followings: req.body.followId } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant unfollow yourself");
  }
});
// PUT twetter/users/changebio
const updateBio = asyncHandler(async (req,res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
        bio: req.body.bio,
    });
    res.send('Bio Updated!');

  } catch(err) {
      console.error(err.message);
      res.send(400).send('Server Error');
  }
  
})
// PUT ///twetter/users/verifyuser
const verifyUser = asyncHandler(async(req,res) => {
  User.findByIdAndUpdate(req.user._id,{$set:{verified:true}},
    (err,result)=>{
     if(err){
         return res.status(422).json({error:"Can't verify"})
     }
     res.json(result)
    })
  })
  

// PUT twetter/users/changefirstname
const updateFirstName = asyncHandler(async (req,res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
        firstname: req.body.firstname,
    });
    res.send('firstname Updated!');

  } catch(err) {
      console.error(err.message);
      res.send(400).send('Server Error');
  }
  
})
// PUT twetter/users/uploadcoverpicture
const updateCoverPic = asyncHandler(async (req,res) => {
  
  User.findByIdAndUpdate(req.user._id,{$set:{coverPicture:req.body.coverPicture}},{new:true},
    (err,result)=>{
     if(err){
         return res.status(422).json({error:"Can't post picture"})
     }
     res.json(result)
})
})

// PUT twetter/users/uploadprofilepicture
const updateProfilePic = asyncHandler(async (req,res) => {
  
  User.findByIdAndUpdate(req.user._id,{$set:{profilePicture:req.body.profilePicture}},{new:true},
    (err,result)=>{
     if(err){
         return res.status(422).json({error:"Can't post picture"})
     }
     res.json(result)
})
})

module.exports = {registerUser, loginUser, getMe, updateCoverPic,getUserProfile,searchUserProfile, 
            updateProfilePic, updateBio ,followPerson, unfollowPerson,searchUser,
             updateFirstName,verifyUser}