import React, { useState, useEffect } from "react";
import twitterLogo from "../../images/twitterLogo.png"
import homeLogo from "../../images/icons/home.svg"
import profileLogo from "../../images/icons/profile.svg"
import notificationLogo from "../../images/icons/notification.svg"
import messageLogo from "../../images/icons/message.svg"
import rectangleLogo from "../../images/icons/rectangle.svg"
import profilePic from "../../images/icons/person.png"
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import verifyBadge from "../../images/icons/verified.svg"


function Sidebar(props) {
  const {showPopup, showVerifyTab, loggedfirstName, 
    loggeduserName,profilePhoto, loggedverify } = props
  const navigate = useNavigate();
  const profileTab = () => {
      navigate("/home/profile");
    }
  const homeTab = () => {
      navigate("/home");    
    }
  const messageTab = () => {
    navigate('/message')
  }
 
  const [showLogout, setShowLogout] = useState(false);
  const toggleLogout = () => {
    setShowLogout(prevState => !prevState)
  }
  const logoutFeature = () => {
    authService.logout()
    navigate("/login")
  }
  return (

   <div className='sidebarContainer'> 
        <div className="sidebarTabs"> 
        <img className='twitterLogoHome' src={twitterLogo} 
            alt="blue bird representing twitter logo" onClick={homeTab}/>  
        <div className="homeTab" onClick={homeTab}> 
          <img className='icons' src={homeLogo} alt="home logo" />   
            Home </div>
        <div className="notificationTab"> 
          <img className='icons' src={notificationLogo} alt=" bell" />   
          Notifications </div>
        <div className="messageTab" onClick={messageTab}> 
          <img className='icons' src={messageLogo} alt=" closed envelope " />   
          Messages </div>
        <div className="memberTab" onClick={showVerifyTab}>
        <img className='icons' src={rectangleLogo} alt=" bird in a box" />   
        Twetter Blue </div>
        <div className="profileTab" onClick={profileTab}> 
        <img className='icons' src={profileLogo} alt=" person outline" />   
        Profile </div>
        <div className="tweetTab" onClick={showPopup}> Tweet </div>
        {showLogout ? 
        <div className="logoutContainer"> 
          <div className="logoutBtn" onClick={logoutFeature}> Log out @{loggeduserName}  </div>
        </div> 
        : ""}
        <div className="userInfoContainer" onClick={toggleLogout}>   
          <img className='profileIcon' src={profilePhoto || profilePic} alt="profile picture of current user" /> 
          <div> 
            <div className="userinfoname"> {loggedfirstName} 
            <span className="lightText" > {loggedverify ? <img className="verifyBadge" src={verifyBadge} alt= "verify badge"/> 
                    : ""  }</span>  </div>   
            <div className="userinfoTab"> @{loggeduserName}   </div>
          </div>
        </div>
        </div>
      </div>
    
  )
}

export default Sidebar