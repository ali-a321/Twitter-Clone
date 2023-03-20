import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authHeaderService from "../../services/auth-header";
import ReactDom from 'react-dom'

const MODAL_STYLES = {
  position: 'fixed',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000,
  borderRadius: '15px'
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

export default function VerifyPopup(props) {
  const { showVerifyTab, loggedverify  } = props
  const navigate = useNavigate();

  const closepop = () => {
    showVerifyTab()
  }

  const onSubmit = () => {
    fetch("http://localhost:5000/twetter/users/verifyuser",{
      method:"put",
      headers:{
          "Content-Type":"application/json",
          "Authorization": authHeaderService.getToken()
      },
    })
    .then(res=>res.json())
    .then(result=>{  console.log(result)})
    .catch(err=>{ console.log(err)})
    closepop()
    navigate("/home")
    window.location.reload();

  }   

  return ReactDom.createPortal(
    <>
    <div style={OVERLAY_STYLES}>
      <div  style={MODAL_STYLES}>
      <div className="closeBtn" onClick={closepop}> X </div>
      { loggedverify ? 
      <div className="blueMemberTitle"> You are a Twetter Blue member!</div> 
      : 
       <div className="verifyContainer">
        <div className="blueMemberTitle"> Become a Twetter blue member! </div>
        <button className="registerBtn" onClick={onSubmit}> Subscribe</button>
       </div>
       }
      </div>
    </div>
    </>,document.getElementById('portal')
  )
}
