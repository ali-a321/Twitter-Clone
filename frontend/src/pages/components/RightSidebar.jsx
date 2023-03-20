import React, { useState, useEffect } from "react";
import  NewsItem  from "./NewsItem"
import axios from "axios";
import authHeaderService from "../../services/auth-header";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../images/icons/searchIcon.svg"


function RightSidebar() {
  const [news, setNews] = useState([])

    useEffect(() => {
        const getArticles = async () => {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.REACT_APP_NEWSAPIKEY}`)
            setNews(response.data.articles)
        }

        getArticles()
    }, [])
   
    const [search, setSearch] = useState("")
    const [userDetails,setUserDetails] = useState([])
    const navigate = useNavigate();
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
        })
        .then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
          console.log(results.user)
        })
    
    }
  
      const userprofileTab = (userid) => {
          navigate(`/user/${userid}`);
        }
      
  return (
    <div className="rightSidebarContanier">
        <div className='searchBox'> 
        <div className="searchBar" > 
        <img className="verifyBadge" src={searchIcon} />
          <input type="text" placeholder='Search Twetter'  className='homeSearch'
                value = {search || ""}  onChange= {(e) => findUsers(e.target.value)}
          /> 
         </div>
   
        <div className="gray">
          {search ? 
          userDetails.map(item => {
            return <li key = {item._id} className="usersSearched" onClick={()=> userprofileTab(item._id)}> 
            <img className="profileIcon" src={item.profilePicture} />
            {item.firstname}  @{item.username} </li>
          }): ""}
        </div>
        </div>
        <div className="newsContainer">
            <div className="what"> What's Happening</div>
            <div>
            {news.map(article => {
                return(
                    <NewsItem 
                        key={article.description}
                        title={article.title}
                        url={article.url}
                    />
                )
            })}
        </div>
        </div>
    
    </div>
  )
}

export default RightSidebar