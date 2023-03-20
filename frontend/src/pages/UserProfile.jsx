import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import heartPic from "../images/icons/heartIcon.svg"
import commentPic from "../images/icons/commentIcon.svg"
import profilePic from "../images/icons/person.png"
import backarrow from "../images/icons/back.svg"
import messageIcon from "../images/icons/message.svg"
import moment from 'moment'
import authHeaderService from "../services/auth-header";
import calendarIcon from "../images/icons/calendar.svg"
import TweetPopup from "./components/TweetPopup";
import VerifyPopup from "./components/VerifyPopup";
import defaultCoverpicture from "../images/icons/coverpicture.png"
import verifyBadge from "../images/icons/verified.svg"
import defaultPic from "../images/icons/person.png"


function UserProfile(props) {
    const {showPopup,TweetPopupBox, verifyTab, showVerifyTab, profilePhoto, 
        loggeduserName, loggedfirstName,commentTweet, 
        likeTweet, loggedId, loggedverify} = props
    
    const navigate = useNavigate();
    const [userProfile, setProfile] = useState("")
    const [showfollow,setShowFollow] = useState(true)
    const {userid} = useParams()
    const [showComments, setShowComments] = useState(false)
    useEffect(()=>{
        fetch(`http://localhost:5000/twetter/users/profile/${userid}`,{
            headers:{
                "Authorization": authHeaderService.getToken()
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setProfile(result)
            checkHelper()
      
        })
     },[userProfile])
    
     const followUser = ()=> {
        const hello = localStorage.getItem("user")
        const hello2 = (JSON.parse(hello))
        const theID = hello2._id
        fetch("http://localhost:5000/twetter/users/follow",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": authHeaderService.getToken()
            },
            body:JSON.stringify({
                user: theID,
                followId: userid
            })
        }).then(res=>res.json())
          .then(data=>{
            localStorage.setItem("profile",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    profile:{
                        ...prevState.profile,
                        followers:[...prevState.profile.followers,data._id]
                       }
                }
            }
            )
            
            check()
       })
       
    }

    const unfollowUser = ()=> {
        const hello = localStorage.getItem("user")
        const hello2 = (JSON.parse(hello))
        const theID = hello2._id
        fetch("http://localhost:5000/twetter/users/unfollow",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": authHeaderService.getToken()
            },
            body:JSON.stringify({
                user: theID,
                followId: userid
            })
        }).then(res=>res.json())
          .then(data=>{
            localStorage.setItem("profile",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    profile:{
                        ...prevState.profile,
                        followers:[...prevState.profile.followers,data._id]
                       }
                }
            }
            )
        
            check()
       })
    }
    const checkHelper =() => {
        setTimeout(()=> {
            check()
         }
         ,100);
  
    }

    const check = async () => {
        
        const alreadyFollower = await userProfile.profile.followers.includes(loggedId);
        const confirm = alreadyFollower
        if (confirm){
            setShowFollow(false)
        }else {
            setShowFollow(true)
        }
    }
    const toggleComment = () => {
        setShowComments(prevState => !prevState)
      }
    const backArrowClicked = () => {
      navigate("/home");
    }
    const msgBtnClicked = (userId) => {
      fetch("http://localhost:5000/twetter/conversations",{
        method:"post",
        headers:{
          "Content-Type":"application/json",
          "Authorization": authHeaderService.getToken()
          
        },
        body:JSON.stringify({
         senderId: loggedId, 
         receiverId: userId
        })
      }).then(res=>res.json())
      .then(results=>{
      })
      navigate("/message");

    }
  return (
    <div className="flex">
        <Sidebar  showPopup = {showPopup} 
        showVerifyTab = {showVerifyTab}
        loggeduserName = {loggeduserName}
        loggedfirstName = {loggedfirstName} 
        profilePhoto = {profilePhoto} 
        loggedverify = {loggedverify}
            />
        {TweetPopupBox ? <TweetPopup showPopup = {showPopup} /> : ""}
        {verifyTab ? <VerifyPopup showVerifyTab = {showVerifyTab} loggedverify = {loggedverify} /> : ""}
        {userProfile ?
        <div className="feedContainer"> 
        <div className="backBanner">
          <img src={backarrow} alt="back arrow" className="backarrow" onClick={backArrowClicked}/>
           {userProfile.profile.firstname} </div>
        <div className="fixedContainer">
            <div className="profileStat"> </div>
            <div className="myCoverPicture"> 
            <img className='coverPictureContainer' src={userProfile.profile.coverPicture || defaultCoverpicture} alt= "cover picture" />  
           
            {showfollow? 
           <> 
           <div className="editProfile"> 
           <img className="editMsgBtn" src={messageIcon} alt="message" onClick={() => msgBtnClicked(userProfile.profile._id)} />  
           <button className="editProfileBtn" onClick={() => followUser()}> Follow </button>
           </div> 
           </>
            :
            <> 
            <div className="editProfile"> 
            <img className="editMsgBtn" src={messageIcon} alt="message" onClick={() => msgBtnClicked(userProfile.profile._id)} />  
            <button className="editProfileBtn" onClick={() => unfollowUser()}> Unfollow </button>
            </div> 
            </>
            }
              <div className="myProfilePicture"> 
              <img className='profilePictureContainer' src= {userProfile.profile.profilePicture || profilePic} alt= "profile picture of current user" />  
               </div> 
            </div>
            <div className="bioContainer"> 
           
                <div className="userProfileInfo"> 
                    <div className="bold"> 
                     {userProfile.profile.firstname} 
                    <span className="lightText" > {userProfile.profile.verified ? <img className="verifyBadge" src={verifyBadge} alt= "verify badge"/> 
                    : ""  }</span>  
                    </div>
                    <div className="lightText"> @{userProfile.profile.username}</div> 
                </div>
                <div className="myBio"> {userProfile.profile.bio } </div>
                <div className="joinedDate"> <img className='calendarContainer' src={calendarIcon}  alt= "calendar" />   Joined {moment(userProfile.profile.dateJoined).format("MMMM YYYY")} </div>
                <div className="followContainer"> 
                    <div className="followingCount"> <strong>{userProfile.profile.followings.length}</strong> Following</div>
                    <div className="followerCount"> <strong> {userProfile.profile.followers.length}</strong> Followers</div>
                </div>
            </div>
            <div className="postContainer"> Tweets
              <div className="ownTweetContainer" >
                {userProfile.tweets.map((post,index) =>  
                  (<div className="userTweet" key={index}>
                  <div>  
                    <img className="profileIcon" src={post?.user?.profilePicture || defaultPic} alt= "profile picture of the person who tweeted this post"/> 
                  </div> 
                  <div className="tweetInfo"> 
                    <div className="userDetails"> 
                      <span className="boldUnderline">{post?.user?.firstname} 
                      <span className="lightText" > {post?.user?.verified ? <img className="verifyBadge" src={verifyBadge} alt= "verify badge"/> 
                              : ""  }</span> 
                       </span>  
                      <span className="lightText"> @{post?.user.username}  </span> 
                      <div className="lightText"> · {moment(post?.timestamp).format("MMMM Do YYYY")} </div>
                    </div> 
                    <div className="tweetContent"> {post?.content}  </div>
                    <div className="tweetInteraction"> 
                      <div className="numberInteractions"><img className='commentBox' src={commentPic} alt="comment box" onClick={toggleComment} />
                      {post?.comments.length}
                      </div>
                      <div className="numberInteractions"> <img className='likeBox' src={heartPic} alt="heart" onClick={() => likeTweet(post._id)} /> 
                      {post?.likes.length}
                      </div>
                    </div>
                    {showComments ? 
                      <> 
                      <form className="popupComment" onSubmit={(e)=>{
                        e.preventDefault()
                        commentTweet(e.target[0].value, post._id)
                        e.target.reset()
                        }}>
                        <img className='profileIcon' src={profilePhoto || defaultPic} alt="profile picture for current user" /> 
                        <input type="text" placeholder="Tweet your reply" className="replyBox" minLength={1} required/> 
                      </form>  
                  { post?.comments?.map(record=>{
                    return(
                        <div className="replies" key={record?._id}> 
                          <div className="replierContainer"> 
                            <img className='replierProfileIcon' src={record?.postedBy?.profilePicture || defaultPic} alt="profile picture of replier" /> 
                            <div className="replierInformation"> 
                              <div className="userDetails">  
                                <span className="boldUnderline" > {record?.postedBy?.firstname}
                                <span className="lightText" > {record?.postedBy?.verified ? <img className="verifyBadge" src={verifyBadge} alt= "verify badge"/> 
                              : ""  }</span>
                               </span> 
                                <span className="lightText"> @{record?.postedBy?.username} </span> 
                                <span className="lightText"> · {moment(record?.created).format("MMMM Do YYYY")} </span>      
                              </div>
                              <div className="replyingTo">Replying to <span className="blue">@{post?.user.username}</span> </div> 
                               <div>  {record?.text} </div>
                            </div>
                          </div>
                      
                         </div>
                      )
                    })
                    }    
                    </>
                    : ""}    
                  </div>  
                  </div>))} 
                  
         
              </div>
            </div>
        </div>
        </div> : ""}
    </div>
  )
}

export default UserProfile