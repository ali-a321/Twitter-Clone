import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../services/post.service";
import AuthService from "../services/auth.service";
import Sidebar from "./components/Sidebar";
import TweetPopup from "./components/TweetPopup";
import heartPic from "../images/icons/heartIcon.svg"
import commentPic from "../images/icons/commentIcon.svg"
import moment from "moment";
import defaultPic from "../images/icons/person.png"
import VerifyPopup from "./components/VerifyPopup";
import RightSidebar from "./components/RightSidebar";
import verifyBadge from "../images/icons/verified.svg"

function Home(props) {
  const {showPopup,TweetPopupBox, verifyTab, showVerifyTab, loggeduserName, loggedfirstName, 
    likeTweet, commentTweet, setPosts, posts, profilePhoto, loggedverify } = props
    const navigate = useNavigate();
    const userprofileTab = (userid) => {
      console.log("clicked")
        navigate(`/user/${userid}`);
      }
  useEffect(() => {
    PostService.getAllPublicPosts().then(
      (response) => {
        setPosts(response.data);
      },
      (error) => {
        console.log(error);
      }
      
    );
  }, [posts]);
  
  const [privatePosts, setPrivatePosts] = useState([]);
  useEffect(() => {
    PostService.getAllPrivatePosts().then(
      (response) => {
        setPrivatePosts(response.data);
      },
      (error) => {
        console.log("Private page", error.response);
        // Invalid token
        if (error.response && error.response.status === 403) {
          AuthService.logout();
          navigate("/login");
          window.location.reload();
        }
      }
    );
  }, [privatePosts]);
  const [followingActive, setfollowingActive] = useState(false);
  const [globalActive, setglobalActive] = useState(true);
  const showFollowingTweets = () => {
    setfollowingActive(true)
    setglobalActive(false)
  }
  const showGlobalTweets = () => {
    setglobalActive(true)
    setfollowingActive(false)
  }
   
   
  const [show,setShow] = useState(false)
  const [privateShow,setPrivateShow] = useState(false)
  const toggleComment = () => {
    setShow(prevState => !prevState)
  }
  const togglePrivateComment = () => {
    setPrivateShow(prevState => !prevState)
  }
  const [formData, setFormData] = useState(
    [{
        content: "",    
    },]
)
const { content } = formData
const onChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
    }) )
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await PostService.createTweets(content).then(
        () => {
          navigate("/home");
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
    setFormData({ content: "", })

  }   

  return (
    <div className="flex">
      <Sidebar showPopup = {showPopup} 
      showVerifyTab = {showVerifyTab}
      loggeduserName = {loggeduserName}
      loggedverify = {loggedverify}
      loggedfirstName = {loggedfirstName}
      profilePhoto = {profilePhoto}
      />
      {TweetPopupBox ? <TweetPopup showPopup = {showPopup} /> : ""}
      {verifyTab ? <VerifyPopup showVerifyTab = {showVerifyTab} loggedverify = {loggedverify} /> : ""}
      <div className="feedContainer"> 
      <div className="fixedContainer">
      
      <div className="headingContainer"> 
        <div className="homeTitle" > Home </div>
        <div className="btnContainer"> 
          {globalActive ?  <button className="globalBtn" onClick={showGlobalTweets}> <strong> Global </strong> </button>:
          <button className="globalBtn" onClick={showGlobalTweets}> Global </button>}
          {followingActive ? 
          <button className="followingBtn" onClick={showFollowingTweets}> <strong>Following </strong> </button>: 
          <button className="followingBtn" onClick={showFollowingTweets}> Following </button> }
        </div>
      </div>
      <div>
      <form onSubmit={onSubmit}> 
            <div className="form-group-tweet-home">
              <div className="tweetHome"> 
              <img  className='profileIcon' src={profilePhoto || defaultPic} alt="profile picture of current user" />
              <input type="text" className="form-control-tweet-home" id="content" 
                  name="content" 
                  required
                  value ={content || ""}
                  placeholder= "What's happening?" 
                  onChange={onChange}
                  autoComplete="off"
                  />
               <button className="tweetBtnHome" onClick={onSubmit}> Tweet</button>
              </div>   
              </div>  
            
        </form>
        
         
      </div>
      {followingActive || !globalActive ? 
      <div className="postContainer">
        {privatePosts?.map((post) => 
        (<div className="userTweet" key={post._id}>
        <div onClick ={() => userprofileTab(post?.user?._id)}>  
          <img className="profileIcon" src={post?.user.profilePicture || defaultPic} alt= "profile picture of the person who tweeted this post"/> 
        </div> 
        <div className="tweetInfo"> 
          <div className="userDetails"> 
            <span className="boldUnderline" onClick ={() => userprofileTab(post?.user?._id)}>{post?.user.firstname} 
            <span className="lightText" > {post?.user?.verified ? <img className="verifyBadge" src={verifyBadge} alt= "verify badge"/> 
                    : ""  }</span> 
             </span>  
            <span className="lightText"> @{post?.user.username}  </span> 
            <div className="lightText"> · {moment(post?.timestamp).format("MMMM Do YYYY")} </div>
          </div> 
          <div className="tweetContent"> {post?.content}  </div>
          <div className="tweetInteraction"> 
            <div className="numberInteractions"><img className='commentBox' src={commentPic} alt="comment box" onClick={togglePrivateComment} />
            {post?.comments.length}
            </div>
            <div className="numberInteractions"> <img className='likeBox' src={heartPic} alt="heart" onClick={() => likeTweet(post._id)} /> 
            {post?.likes.length}
            </div>
          </div>
          {privateShow ? 
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
                      <span className="boldUnderline" onClick ={() => userprofileTab(record?.postedBy?._id)}> {record?.postedBy?.firstname}
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
      :  
      <div className="postContainer">
        {posts?.map((post) => (
          <div className="userTweet" key={post._id}> 
            <div onClick ={() => userprofileTab(post?.user?._id)}>
              <img className="profileIcon" src={post?.user.profilePicture || defaultPic} alt= "profile picture of the person who tweet this post"/> 
            </div>
            <div className="tweetInfo"> 
              <div className="userDetails"> 
                <span className="boldUnderline" onClick ={() => userprofileTab(post?.user?._id)}> 
                {post?.user.firstname} 
                <span className="lightText" > {post?.user?.verified ? <img className="verifyBadge" src={verifyBadge} alt= "verify badge"/> 
                    : ""  }</span>
                </span>
            
               
                <span className="lightText" onClick ={() => userprofileTab(post?.user?._id)}> @{post?.user.username}</span> 
                <span className="lightText"> · {moment(post?.timestamp).format("MMMM Do YYYY")} </span>
              </div> 
              <div className="tweetContent"> {post?.content} </div>
              <div className="tweetInteraction"> 
                <div className="numberInteractions"><img className='commentBox' src={commentPic} alt="comment box" onClick={toggleComment} />
                  {post?.comments.length}
                </div>
                <div className="numberInteractions"> <img className='likeBox' src={heartPic} alt="heart" onClick={() => likeTweet(post._id)} /> 
                  {post?.likes.length}
                </div>
              </div>
              {show ?
          <> 
          <form className="popupComment" onSubmit={(e)=>{
            e.preventDefault()
            commentTweet(e.target[0].value, post._id)
            e.target.reset()
            }}>
      
            <img className='profileIcon' src={profilePhoto || defaultPic} alt="profile picture of current user" /> 
            <input type="text" placeholder="Tweet your reply" className="replyBox" minLength={1} required /> 
          </form>  
          { post?.comments?.map(record=>{
            return(
                <div className="replies" key={record?._id}> 
                  <div className="replierContainer"> 
                    <img className='replierProfileIcon' src={record.postedBy?.profilePicture || defaultPic} alt="profile picture of replier" /> 
                    <div className="replierInformation"> 
                    <div className="userDetails">  
                      <span className="boldUnderline" onClick ={() => userprofileTab(record?.postedBy?._id)}> 
                      {record?.postedBy?.firstname} 
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
            
         
          </div>
        ))}
      </div>}
      </div> 
      </div>
    <RightSidebar />
    </div>
  )
}

export default Home