import React from 'react'
import moment from 'moment';

function Message(props) {
  
  const {message, own} = props
  
  return (
    <div>
     
      <div className={own ? "message own" : "message theirs"}> 
          <div className="messageTop">
          <p className="messageText"> {message.text} </p>
          </div>
          <div className="lightTextMessage"> {moment(message.createdAt).format("MMMM Do YYYY, h:mm a")}</div>
      </div>
     </div>
 
  );
}

export default Message