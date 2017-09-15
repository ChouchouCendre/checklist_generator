import React from 'react'


const Header = (props) => {
  return (
    <div className="logo">
      <a href="http://www.lesaventuresduchouchou.com/" target="_blank"><img src='assets/logo.png' /></a>
      <br />
      <span className="subtitle">{ props.subtitle }</span>
    </div>
  )
}

export default Header
