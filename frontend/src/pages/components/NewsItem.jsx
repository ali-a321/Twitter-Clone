import React from 'react'

function NewsItem(props) {
  const {title, url} = props
  
  return (
    <div className="newsApp">
        <ul className='newsItem'>
            <li className='newsTitle'><a  href={url} target="_blank" className='newsItem'>{title} </a> </li>
        </ul>
    </div>
  )
}

export default NewsItem