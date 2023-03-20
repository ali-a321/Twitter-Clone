import React, { useState, useEffect } from "react";
import PostService from "../../services/post.service";
import { useNavigate } from "react-router-dom";
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

function TweetPopup(props) {
    const { showPopup, } = props
    
    const navigate = useNavigate();
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
        closepop()
      }   

    const closepop = () => {
      showPopup()
    }


  return ReactDom.createPortal(
    <>
    <div style={OVERLAY_STYLES}>
        <div  style={MODAL_STYLES}>
        <div className="closeBtn" onClick={closepop}> X </div>
        <form onSubmit={onSubmit}> 
            <div className="form-group-tweet">
              <input type="text" className="form-control-tweet" id="content" 
                  name="content" 
                  required
                  value ={content || ""}
                  placeholder= "What's happening?" 
                  onChange={onChange}
                  autoComplete="off"
                  />
              </div>     
        </form>
        <button className="tweetBtn" onClick={onSubmit}> Tweet</button>
        </div>
    </div>
    </>,document.getElementById('portal')
  )
}

export default TweetPopup