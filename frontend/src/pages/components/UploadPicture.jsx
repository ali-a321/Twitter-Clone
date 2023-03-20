import React, { useState, useEffect } from 'react';
import authHeaderService from '../../services/auth-header';
import postService from '../../services/post.service';


function UploadPicture(props) {
    const {setEditbtn, loggedBio, loggedfirstName} = props
    const [coverImage,setCoverImage] = useState("")
    useEffect(()=>{
        if(coverImage){
         const data = new FormData()
         data.append("file",coverImage)
         data.append("upload_preset","twitter-clone")
         data.append("cloud_name", "dadpcmkn3")
         fetch("https://api.cloudinary.com/v1_1/dadpcmkn3/image/upload",{
             method:"post",
             body:data
         })
         .then(res=>res.json())
         .then(data=>{      
          fetch('http://localhost:5000/twetter/users/uploadcoverpicture',{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": authHeaderService.getToken()
                },
                body:JSON.stringify({ coverPicture:data.url })
            })
            .then(res=>res.json())
            .then(result=>{
                window.location.reload()
            })
         })
         .catch(err=>{
             console.log(err)
         })
        }
     },[coverImage])
     
     const updateCoverPhoto = (file)=>{
         setCoverImage(file)
     }
    
    const [profileImage,setProfileImage] = useState("")
    const updateProfilePhoto = (file)=>{
        setProfileImage(file)
    }
    useEffect(()=>{
        if(profileImage){
         const data = new FormData()
         data.append("file", profileImage)
         data.append("upload_preset","twitter-clone")
         data.append("cloud_name", "dadpcmkn3")
         fetch("https://api.cloudinary.com/v1_1/dadpcmkn3/image/upload",{
             method:"post",
             body:data
         })
         .then(res=>res.json())
         .then(data=>{      
          fetch('http://localhost:5000/twetter/users/uploadprofilepicture',{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": authHeaderService.getToken()
                },
                body:JSON.stringify({ profilePicture:data.url })
            })
            .then(res=>res.json())
            .then(result=>{
                window.location.reload()
            })
         })
         .catch(err=>{
             console.log(err)
         })
        }
     },[profileImage])
     const closepop = () => {
        setEditbtn(false)
      }
      const [formData, setFormData] = useState(
        {
            bio: loggedBio,
            
        }
    )
    const { bio } = formData
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }) )
      }
      const onSubmit = async (e) => {
        e.preventDefault()
        try {
          await postService.updateBio(bio).then(
           
            (error) => {
              console.log(error);
            }
          );
        } catch (err) {
          console.log(err);
        }
        setFormData({ bio: ""})
        closepop()
        window.location.reload()

        
      }   
      //Name FORM DATA
      const [nameData, setNameData] = useState(
        {
            firstname: loggedfirstName,
            
        }
    )
    const { firstname } = nameData
    const onChangeName = (e) => {
        setNameData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }) )
      }
      const onSubmitName = async (e) => {
        e.preventDefault()
        try {
          await postService.updateFirstname(firstname).then(
           
            (error) => {
              console.log(error);
            }
          );
        } catch (err) {
          console.log(err);
        }
        setNameData({ firstname: ""})
        closepop()
        
      }   
      

  return (
    <div className='editPopupModal'> 
        <div className="uploadBtn">
        <div className="closeBtn" onClick={closepop}> X </div>
            <span> Update Cover Photo</span>
            <input type="file" onChange={(e)=>updateCoverPhoto(e.target.files[0])} /> 
            <span> Update Profile Picture</span>
            <input type="file" onChange={(e)=>updateProfilePhoto(e.target.files[0])} />
            <div> 
            <form onSubmit={onSubmitName}> 
                <input type="text"  name="firstname" value={ firstname || ""}  
                onChange={onChangeName} autoComplete= "off"/> 
                <button type='submit'> Update Name </button>
                </form>
            </div>
            <div>
                <form onSubmit={onSubmit}> 
                <input type="text"  name="bio" value={bio || ""}  
                onChange={onChange} autoComplete= "off"/> 
                <button type='submit'> Update Bio </button>
                </form>
               
            </div>
        </div>
    </div>
  )
}

export default UploadPicture