import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../services/post.service";
import AuthService from "../services/auth.service";
import authHeaderService from "../services/auth-header";
import Sidebar from "./components/Sidebar";
import TweetPopup from "./components/TweetPopup";
import heartPic from "../images/icons/heartIcon.svg"
import commentPic from "../images/icons/commentIcon.svg"
import deletePic from "../images/icons/deleteIcon.svg"
import profilePic from "../images/icons/person.png"
import calendarIcon from "../images/icons/calendar.svg"
import backarrow from "../images/icons/back.svg"
import UploadPicture from "./components/UploadPicture";
import defaultCoverpicture from "../images/icons/coverpicture.png"
import moment from 'moment'
import VerifyPopup from "./components/VerifyPopup";
import verifyBadge from "../images/icons/verified.svg"
import defaultPic from "../images/icons/person.png"




function MyProfile(props) {
    const {showPopup,TweetPopupBox, verifyTab, showVerifyTab, loggeduserName, loggedfirstName, 
      loggedBio, loggedFollowerCount,loggedFollowingCount, likeTweet, loggedverify,
      commentTweet, coverPhoto, profilePhoto, joinedDate} = props
    
    const [myPosts, setMyPosts] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
      PostService.getMyTweets().then(
        (response) => {
          setMyPosts(response.data);
        },
        (error) => {
         if (error.response && error.response.status === 403) {
            AuthService.logout();
            navigate("/login");
            window.location.reload();
          }
        }
      );
    }, [myPosts]);
    const [show,setShow] = useState(false)
    const toggleComment = () => {
      setShow(prevState => !prevState)
    } 
  
    const deleteTweet = (postid) => {
      fetch(`http://localhost:5000/twetter/home/profile/delete/${postid}`,{
        method:"delete",
        headers:{
          "Authorization": authHeaderService.getToken()
        }
      })
      .then(res=>res.json())
      
    }
  const [editBtn,setEditbtn] = useState(false)
  const showFeatures = () => {
    setEditbtn(prevState => !prevState)
  }
  const backArrowClicked = () => {
    navigate("/home");
  }
  return (
    <div className="flex">
    <Sidebar
      showPopup={showPopup}
      showVerifyTab={showVerifyTab}
      loggeduserName={loggeduserName}
      loggedfirstName={loggedfirstName}
      profilePhoto={profilePhoto}
      loggedverify={loggedverify}
    />
    {TweetPopupBox ? <TweetPopup showPopup={showPopup} /> : ""}
    {verifyTab ? (
      <VerifyPopup showVerifyTab={showVerifyTab} loggedverify={loggedverify} />
    ) : (
      ""
    )}
    <div className="feedContainer">
    <div className="backBanner">
          <img src={backarrow} alt="back arrow" className="backarrow" onClick={backArrowClicked}/>
           {loggedfirstName} </div>
      <div className="fixedContainer">
        <div className="profileStat"> </div>
        <div className="myCoverPicture">
          <img
            className="coverPictureContainer"
            src={coverPhoto || defaultCoverpicture}
            alt="cover picture"
          />
          <div className="editProfile"> 
          <button className="editProfileBtn" onClick={showFeatures}>
            Edit Profile
          </button>
          </div>
          {editBtn ? (
            <UploadPicture
              setEditbtn={setEditbtn}
              loggedBio={loggedBio}
              loggedfirstName={loggedfirstName}
            />
          ) : (
            ""
          )}
  
          <div className="myProfilePicture">
            <img
              className="profilePictureContainer"
              src={profilePhoto || profilePic}
              alt="profile picture of current user"
            />
          </div>
        </div>
        <div className="bioContainer">
          <div className="bold">
            {loggedfirstName}
            <span className="lightText">
              {loggedverify ? (
                <img
                  className="verifyBadge"
                  src={verifyBadge}
                  alt="verify badge"
                />
              ) : (
                ""
              )}
            </span>
          </div>
          <div className="lightText"> @{loggeduserName}</div>
          <div className="myBio"> {loggedBio} </div>
          <div className="joinedDate">
            <img
              className="calendarContainer"
              src={calendarIcon}
              alt="calendar"
            />
            Joined {moment(joinedDate).format("MMMM YYYY")}
          </div>
          <div className="followContainer">
            <div className="followingCount">
              <strong>{loggedFollowingCount || 0}</strong> Following
            </div>
            <div className="followerCount">
              <strong> {loggedFollowerCount || 0}</strong> Followers
            </div>
          </div>
        </div>
        <div className="postContainer">
          Tweets
          <div className="ownTweetContainer">
            {myPosts.map((post, index) => (
              <div className="userTweet" key={index}>
                <div>
                  <img
                    className="profileIcon"
                    src={post?.user?.profilePicture || defaultPic}
                    alt="profile picture of the person who tweeted this post"
                  />
                </div>
                <div className="tweetInfo">
                  <div className="userDetails">
                    <span className="boldUnderline">
                      {post?.user?.firstname}
                      <span className="lightText">
                        {post?.user?.verified ? (
                          <img
                            className="verifyBadge"
                            src={verifyBadge}
                            alt="verify badge"
                          />
                        ) : (
                          ""
                        )}
                      </span>
                    </span>
                    <span className="lightText"> @{post?.user.username} </span>
                    <div className="lightText">
                      · {moment(post?.timestamp).format("MMMM Do YYYY")}
                    </div>
                  </div>
                  <div className="tweetContent"> {post?.content} </div>
                  <div className="tweetInteraction">
                    <div className="numberInteractions">
                      <img
                        className="commentBox"
                        src={commentPic}
                        alt="comment box"
                        onClick={toggleComment}
                      />
                      {post?.comments.length}
                    </div>
                    <div className="numberInteractions">
                      <img
                        className="likeBox"
                        src={heartPic}
                        alt="heart"
                        onClick={() => likeTweet(post._id)}
                      />
                      {post?.likes.length}
                    </div>
                    <div className="numberInteractions">
                      <img
                        className="commentBox"
                        src={deletePic}
                        alt="trash bin"
                        onClick={() => deleteTweet(post._id)}
                      />
                    </div>
                  </div>
                  {show ? (
                    <>
                      <form
                        className="popupComment"
                        onSubmit={(e) => {
                          e.preventDefault();
                          commentTweet(e.target[0].value, post._id);
                          e.target.reset();
                        }}
                      >
                        <img
                          className="profileIcon"
                          src={profilePhoto || defaultPic}
                          alt="profile picture for current user"
                        />
                        <input
                          type="text"
                          placeholder="Tweet your reply"
                          className="replyBox"
                          minLength={1}
                          required
                        />
                      </form>
                      {post?.comments?.map((record) => {
                        return (
                          <div className="replies" key={record?._id}>
                            <div className="replierContainer">
                              <img
                                className="replierProfileIcon"
                                src={
                                  record?.postedBy?.profilePicture || defaultPic
                                }
                                alt="profile picture of replier"
                              />
                              <div className="replierInformation">
                                <div className="userDetails">
                                  <span className="boldUnderline">
                                    {record?.postedBy?.firstname}
                                    <span className="lightText">
                                      {record?.postedBy?.verified ? (
                                        <img
                                          className="verifyBadge"
                                          src={verifyBadge}
                                          alt="verify badge"
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </span>
                                  </span>
                                  <span className="lightText">
                                  
                                    @{record?.postedBy?.username}
                                  </span>
                                  <span className="lightText">
                                    ·
                                    {moment(record?.created).format(
                                      "MMMM Do YYYY"
                                    )}
                                  </span>
                                </div>
                                <div className="replyingTo">
                                  Replying to 
                                  <span className="blue">
                                    @{post?.user.username}
                                  </span> 
                                </div>
                                <div> {record?.text} </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default MyProfile