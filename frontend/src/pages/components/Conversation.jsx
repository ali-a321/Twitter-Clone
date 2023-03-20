import axios from "axios";
import React, { useState, useEffect } from "react";
import defaultPic from "../../images/icons/person.png"
import authHeaderService from "../../services/auth-header";

function Conversation(props) {
  const {conversation,loggedId } = props 
  const [user,setUser] = useState(null)
  useEffect(() => {
    const friendId = conversation.members.find(m=>m !== loggedId)
    const getUser = async ()=>{
      try {
        const res = await axios("http://localhost:5000/twetter/users/searchuser?userId=" + friendId, 
        { headers: authHeaderService.authHeader() });
        setUser(res.data);
      } catch (error) {
          console.log(error);
      }
    } 
    getUser()
  }, [conversation,loggedId])

  return (
    <div className="conversationBox">
      <img
        className="profileIcon"
        src={user?.profilePicture || defaultPic}
        alt="profile picture of person you are sending message to"
      />
      <div className="conversationDetails"> 
        <div className="conversationName"> {user?.firstname} {" "}
        <span className="conversationName" >@{user?.username}</span>
        <span className="conversationName" > </span>

        </div>
        <div className="recentMessage"> </div>
      </div>
    </div>
  );
}
export default Conversation