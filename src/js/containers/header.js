import React from 'react'


const Header = () => {
  return (
    <div className="logo">
      <a href="http://www.lesaventuresduchouchou.com/" target="_blank"><img src='assets/logo.png' /></a>
      <br />
      <span className="subtitle">{ this.props.subtitle }</span>
    </div>
  )
}

export default Header
