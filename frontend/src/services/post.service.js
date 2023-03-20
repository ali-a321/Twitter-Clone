import axios from "axios";
import authHeaderService from "./auth-header";

const getAllPublicPosts = () => {
  return axios.get("http://localhost:5000/twetter/home" );
};

const getAllPrivatePosts = () => {
  return axios.get("http://localhost:5000/twetter/home/feed", { headers: authHeaderService.authHeader() });
};

const getUserInformation = () => {
  return axios.get("http://localhost:5000/twetter/users/me", { headers: authHeaderService.authHeader() });
}

const getMyTweets = () => {
  return axios.get("http://localhost:5000/twetter/home/mytweets", { headers: authHeaderService.authHeader() });
}
const createTweets = (content) => {
 axios.post("http://localhost:5000/twetter/home/create", {content}, { headers: authHeaderService.authHeader() })
 .then((response) => {
  console.log(response)
})
.catch((error) => {
  console.log(error)
})
};

const updateBio = (bio) => {
  axios.put("http://localhost:5000/twetter/users/changebio", {bio},
  { headers: 
  { "Content-Type":"application/json",  
  "Authorization": authHeaderService.getToken()} 
  }, 
  {body: JSON.stringify({
    bio
    }) })
  .then((response) => {
    console.log(response)
  })
  .catch((error) => {
    console.log(error)
  })
}
const updateFirstname = (firstname) => {
  axios.put("http://localhost:5000/twetter/users/changefirstname", {firstname},
  { headers: 
  { "Content-Type":"application/json",  
  "Authorization": authHeaderService.getToken()} 
  }, 
  {body: JSON.stringify({
    firstname
    }) })
  .then((response) => {
    console.log(response)
  })
  .catch((error) => {
    console.log(error)
  })
}
const checkBlue = (verified) => {
  axios.put("http://localhost:5000/twetter/users/verifyuser" ,{verified},
  { headers: 
    { "Content-Type":"application/json",  
    "Authorization": authHeaderService.getToken()} 
    },
    {body: JSON.stringify({
      verified:true,
      }) }
  .then((response) => {
    console.log(response)
  }))
  .catch((error) => {
    console.log(error)
  })
}

 
const postService = {
  getAllPublicPosts,
  getAllPrivatePosts,
  getUserInformation,
  getMyTweets,
  createTweets,
  updateFirstname,
  updateBio,
  checkBlue,
};

export default postService;