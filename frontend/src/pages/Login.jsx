import React from 'react'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import twitterLogo from "../images/twitterLogo.png"
import AuthService from "../services/auth.service";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(
        [{
            username: "",
            password: "",
        },]
    )
    const { username, password} = formData
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }) )
      }
      const onSubmit = async (e) => {
        e.preventDefault()
        try {
          await AuthService.login(username, password).then(
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
        setFormData({ username: "", password: "" })
      }   
      
  return (
    <div className='loginContainer'>
        <img className='twitterlogo' src={twitterLogo} 
            alt="blue bird representing twitter logo" />  
        <section className="form">
            <form onSubmit={onSubmit}> 
            <div className="form-group">
            <div className='loginTitle'> Sign in to Twetter </div>
              <div className="form-group">
              <input type="text" className="form-control" id="username" 
                  name="username" 
                  required
                  value ={username || ""}
                  placeholder= "Username" 
                  onChange={onChange}
                  autoComplete="off"
                  />
              </div>        
              <div className="form-group">
              <input type="password" className="form-control" id="password" 
                  name="password" 
                  required
                  value ={password || ""}
                  placeholder= "Password" 
                  onChange={onChange}
                  autoComplete="off"
                  />
              </div>        
            </div>
            <div className="form-group">
              <button className="registerBtn" type="submit" > Login </button>
            </div>
            </form>
          </section>
          <div className='loginPrompt'> Don't have an account?  <a href='/'> Sign up </a> </div>
    </div>
  )
}

export default Login