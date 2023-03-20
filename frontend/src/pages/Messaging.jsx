import React, { useState, useEffect, useRef } from "react";
import Sidebar from './components/Sidebar'
import TweetPopup from './components/TweetPopup'
import VerifyPopup from './components/VerifyPopup'
import Conversation from './components/Conversation'
import Message from './components/Message'
import addMessageIcon from "../images/icons/addMessageIcon.svg"
import sendIcon from "../images/icons/sendIcon.svg"
import authHeaderService from "../services/auth-header";
import axios from "axios";
import moment from "moment";
import searchIcon from "../images/icons/searchIcon.svg"
import defaultPic from "../images/icons/person.png"
import backarrow from "../images/icons/back.svg"
import { useNavigate } from "react-router-dom";


function Messaging(props) {
  const {showPopup,TweetPopupBox, verifyTab, showVerifyTab, loggeduserName, loggedfirstName, loggedBio, 
        loggedverify, profilePhoto,loggedId } = props

  const navigate = useNavigate();
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [currentMessages, setCurrentMessages] = useState([])
  const [newMessages, setNewMessages] = useState("")
  const scrollRef = useRef()
  
  
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/twetter/conversations/"+loggedId, { headers: authHeaderService.authHeader() });
        setConversations(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getConversations()
  }, [loggedId])
  useEffect(() => {
    const getMsgs = async() => {
      try {
        const res = await axios.get("http://localhost:5000/twetter/messages/"+currentChat?._id, { headers: authHeaderService.authHeader() })
        setCurrentMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getMsgs()
  }, [currentChat])
  
  
  
  const [user,setUser] = useState(null)

  const convoClicked = async (item) => {
    setCurrentChat(item)
    const friendId = await item.members.find(m=>m !== loggedId)
      try {
        const res = await axios("http://localhost:5000/twetter/users/searchuser?userId=" + friendId, 
        { headers: authHeaderService.authHeader() });
        setUser(res.data);
      } catch (error) {
          console.log(error);
      }
  }
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({behaviour: "smooth"})
  },[currentMessages])
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: loggedId,
      text: newMessages,
      conversationId: currentChat._id,
    };
    try {
      const res = await axios.post("http://localhost:5000/twetter/messages", message, { headers: authHeaderService.authHeader() })
      setCurrentMessages([...currentMessages, res.data])
      setNewMessages("")
    } catch (error) {
      console.log(error)
    }
  }
  const [search, setSearch] = useState("")
  const [userDetails,setUserDetails] = useState([])
  const findUsers = (query) => {
      setSearch(query)
      fetch("http://localhost:5000/twetter/users/search",{
        method:"post",
        headers:{
          "Content-Type":"application/json",
          "Authorization": authHeaderService.getToken()
          
        },
        body:JSON.stringify({
          query
        })
      }).then(res=>res.json())
      .then(results=>{
        setUserDetails(results.user)
      })
      
  }

  const startConvo = ( userId) => {
  
    startConversation(userId,loggedId)
  }
  const startConversation = (userId,loggedId) => {
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
    window.location.reload();

  }
  const backClicked = () => {
    navigate("/home")
  }
  return (
    <div className="flex">
    <Sidebar showPopup = {showPopup} 
     showVerifyTab = {showVerifyTab}
    loggeduserName = {loggeduserName}
    loggedfirstName = {loggedfirstName} 
    profilePhoto = {profilePhoto} />
    
    {TweetPopupBox ? <TweetPopup showPopup = {showPopup} /> : ""}
    {verifyTab ? <VerifyPopup showVerifyTab = {showVerifyTab}  loggedverify = {loggedverify}/> : ""}
    <div className='feedMessageContainer'>
    <div className="fixedContainer">
        <div className='messageTitle'>
          <img src={backarrow} alt="go to homepage" className="smallbackArrow" onClick={backClicked}/> 
           Messages  
        <img src={addMessageIcon} alt="mail with plus sign" className='icons'/> 
        </div>
        <div className='msgSearchBox'> 
        <img src={searchIcon} className="verifyBadge" alt="magnifying glass"/>
          <input type="text" placeholder='Search Direct Messages'  className='search'
                value = {search || ""}  onChange= {(e) => findUsers(e.target.value)}
          /> 
        </div>
        <div>
          {search ?
           userDetails.map(item => {
            return <li className="usersSearched" onClick={()=> startConvo(item._id)}>
              <img src={item.profilePicture} alt="profile picture of user" className="profileIcon" />
              {item.firstname}  @{item.username} </li>
          })
        : "" }
         
        </div>
        {conversations.map((item) => (
              <div onClick={() => convoClicked(item)}>
                <Conversation conversation={item} loggedId={loggedId} />
              </div>
            ))}
    </div>
    </div>
      <div className='messageBox'> 
      <div className="chatBoxWrapper">
      {currentChat ? (
        <>
        <div className="chatBoxTop"> 
        <div className='recieverInfo'>
        
          <> 
          <div className='recieverPfp'> 
            <img src={user?.profilePicture || defaultPic} alt="profile picture of reciever" className="pfp"/> 
          </div>
          <div className='recieverfirstname'> {user?.firstname} </div>
          <div className='recieverusername'> @{user?.username}</div>
          <div className='recieverBio'> {user?.bio} </div>
          <div className='recieverBox'>
              <div className='lightText'> Joined {moment(user?.datejoined).format("MMMM YYYY")}  </div>
              <div className='lightText'>· {user?.followers.length} Followers </div>
          </div>
          </>
        
        </div>
        {currentMessages.map((m) => (
            <div ref={scrollRef}> 
            <Message message={m} own={m.sender === loggedId} />
            </div>   
           ))}
    
          </div>
          <div className="chatBoxBottom">
            <textarea
              className="chatMessageInput"
              placeholder="Start a new message"
              onChange={(e) => setNewMessages(e.target.value)}
              value = {newMessages}
            
            ></textarea>
            <button className="chatSubmitButton" >
              <img src={sendIcon} alt="send button" className="sendBtn"onClick={handleSubmit}/>
            </button>
          </div>
          </>
        ): (
          <span className="noConversationText">
          <strong>Select a message </strong> 
          Choose from your existing conversations, start a new one, or just keep swimming.
          </span>)
        }
         
            
          </div>
      </div> 
    </div>   
  )
}
export default Messaging