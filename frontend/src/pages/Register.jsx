import React from 'react'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import twitterLogo from "../images/twitterLogo.png"
import AuthService from "../services/auth.service";


function Register() {
    const [showForm, setShowForm] = useState(false)
    const navigate = useNavigate();

    const [formData, setFormData] = useState(
        [{
            firstname: "",
            lastname: "",
            username: "",
            password: "",
        },]
    )
    const {firstname, lastname, username, password} = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }) )
      }
    const onSubmit = async(e) => {
        e.preventDefault()
        try {
          await AuthService.signup(firstname, lastname,username, password).then(
            (response) => {
              // check for token and user already exists with 200
              //   console.log("Sign up successfully", response);
              navigate("/login");
              window.location.reload();
            },
            (error) => {
              console.log(error);
            }
          );
        } catch (err) {
          console.log(err);
        }
        setFormData({ firstname: "", lastname: "", username: "", password: "" })
      
      }   
      const toggleForm = () => {
        setShowForm(true)
      }
  return (
    <div className='registerContainer'>  
         {!showForm ? (
        <div> 
            <img className='twitterLogo' src={twitterLogo} 
            alt="blue bird representing twitter logo" />  
            <div className='registerTitle'>Join Twetter today </div>
            <button className='registerBtn' onClick={toggleForm}> Create account </button>
            <div className='uselessInfo'> By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.</div>
            <div className='loginPrompt'> Have an account already? <a href='/login'> Log in </a> </div>
        </div>
        ) : "" }
        {showForm ? (
        <section className="form">
            <form onSubmit={onSubmit}> 
            <div className="form-group">
              <label htmlFor="text"> Create your account </label>
              <div className="form-group">
                  <input type="text" className="form-control" id="firstname" 
                  name="firstname" 
                  required
                  value ={firstname || ""}
                  placeholder= "First name" 
                  onChange={onChange}
                  autoComplete="off"
                  />
              </div>
              <div className="form-group">
              <input type="text" className="form-control" id="lastname" 
                  name="lastname" 
                  required
                  value ={lastname || ""}
                  placeholder= "Last name" 
                  onChange={onChange}
                  autoComplete="off"
                  />
              </div>        
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
              <button className="registerBtn" type="submit" > Register </button>
            </div>
            </form>
          </section>
           ) : "" }
    </div>
  )
}

export default Register