import './App.css';
import React, {useState, useEffect} from 'react';
import {Route, Routes} from 'react-router-dom'
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyProfile from './pages/MyProfile';
import postService from "./services/post.service";
import authHeaderService from "./services/auth-header";
import UserProfile from './pages/UserProfile';
import Messaging from './pages/Messaging';

function App() {

  const [TweetPopupBox, setTweetPopupBox] = useState(false)
  const showPopup = () => {
    setTweetPopupBox(TweetPopup => !TweetPopup)
    console.log(TweetPopupBox)
  }

  const [verifyTab, setVerifyTab] = useState(false);
  const showVerifyTab = () => {
    setVerifyTab(verifyTab => !verifyTab)
    console.log(verifyTab)
  }
  const [loggeduserName, setLoggedUserName] = useState()
  const [loggedfirstName, setLoggedfirstName] = useState()
  const [loggedBio, setLoggedBio] = useState()
  const [loggedverify, setLoggedverify] = useState()
  const [loggedId, setLoggedId] = useState()
  const [loggedFollowerCount, setloggedFollowerCount] = useState()
  const [loggedFollowingCount, setloggedFollowingCount] = useState()
  const [coverPhoto, setCoverPhoto] = useState()
  const [profilePhoto, setProfilePhoto] = useState()
  const [joinDate, setJoinDate] = useState()
  const [currentUserInformation, setCurrentUserInformation] = useState()
    useEffect(() => {
        postService.getUserInformation().then(
          (response) => {
            setLoggedId(response.data._id)
            setLoggedUserName(response.data.username);
            setLoggedfirstName(response.data.firstname);
            setLoggedverify(response.data.verified);
            setLoggedBio(response.data.bio);
            setCoverPhoto(response.data.coverPicture)
            setProfilePhoto(response.data.profilePicture)
            setloggedFollowerCount(response.data.followers.length)
            setloggedFollowingCount(response.data.followings.length)
            setJoinDate(response.data.datejoined)
           
            setCurrentUserInformation(response.data)
      
          },
          (error) => {
            console.log(error);
          }
          
        );
      }, []);
 
      const [data,setData] = useState([])
      const [posts, setPosts] = useState([]);
      const commentTweet = (text,tweetId)=>{
        console.log(text,tweetId)
        fetch('http://localhost:5000/twetter/home/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": authHeaderService.getToken()
            },
            body:JSON.stringify({
                tweetId,
                text
            })
        }).then(res=>res.json())
          .then(result=>{
            console.log(result)
            const newData = data.map(post=>{
              if(post._id==result._id){
                  return result
              }else{
                  return post
              }
           })
          setPosts(newData)
        }).catch(err=>{
            console.log(err)
        })
      }
      
      const likeTweet = (id)=>{
        fetch('http://localhost:5000/twetter/home/likes/tweet',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": authHeaderService.getToken()
            },
            body:JSON.stringify({
                tweetId:id
            })
        }).then(res=>res.json())
          .then(result=>{
                 //   console.log(result)
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
        
        }).catch(err=>{
            console.log(err)
        })
    }

  return (
 
    <div className="App">
      <Routes>
        <Route exact path= '/' element ={<Register />} />
        <Route path= '/login' element ={<Login />} />
        <Route exact path= '/home'
         element ={<Home 
         showPopup= {showPopup} 
         TweetPopupBox= {TweetPopupBox}
         verifyTab = {verifyTab}
         showVerifyTab = {showVerifyTab}
         loggeduserName = {loggeduserName}
         loggedfirstName = {loggedfirstName} 
         loggedverify = {loggedverify}
         likeTweet = {likeTweet}
         commentTweet = {commentTweet}
         setPosts = {setPosts}
         posts = {posts}
         profilePhoto = {profilePhoto}
         />} />
        <Route path= '/home/profile' 
        element ={<MyProfile 
        showPopup ={showPopup} 
        TweetPopupBox= {TweetPopupBox}
        verifyTab = {verifyTab}
        showVerifyTab = {showVerifyTab}
        loggeduserName = {loggeduserName}
        loggedverify = {loggedverify}
        loggedfirstName = {loggedfirstName}
        loggedBio = {loggedBio}
        loggedFollowerCount = {loggedFollowerCount}
        loggedFollowingCount = {loggedFollowingCount}
        coverPhoto = {coverPhoto}
        profilePhoto = {profilePhoto}
        likeTweet = {likeTweet}
        commentTweet = {commentTweet}
        joinDate = {joinDate}
         
         
        />} />
        <Route path= '/message' element ={<Messaging 
        showPopup= {showPopup} 
        TweetPopupBox= {TweetPopupBox}
        verifyTab = {verifyTab}
        showVerifyTab = {showVerifyTab}
        loggeduserName = {loggeduserName}
        loggedfirstName = {loggedfirstName} 
        profilePhoto = {profilePhoto}
        loggedId = {loggedId}
        currentUserInformation = {currentUserInformation}
        />} />

        <Route path= '/user/:userid' 
        element ={<UserProfile 
        loggeduserName = {loggeduserName}
        loggedfirstName = {loggedfirstName} 
        loggedverify = {loggedverify}
        likeTweet = {likeTweet}
        commentTweet = {commentTweet}
        showPopup ={showPopup} 
        TweetPopupBox= {TweetPopupBox}
        verifyTab = {verifyTab}
        showVerifyTab = {showVerifyTab}
        profilePhoto = {profilePhoto}
        currentUserInformation = {currentUserInformation}
        loggedId = {loggedId}
        
        
        
        />} /> 
      </Routes>
    </div>
 
  );
}

export default App;
