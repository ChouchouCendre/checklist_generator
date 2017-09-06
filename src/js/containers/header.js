import React from 'react'

class Header extends React.Component {
  render () {
    return (
      <div className="logo">
        <a href="http://www.lesaventuresduchouchou.com/" target="_blank"><img src='assets/logo.png' /></a>
        <br />
        <span className="subtitle">{ this.props.subtitle }</span>
      </div>
    )
  }
}

export default Header
