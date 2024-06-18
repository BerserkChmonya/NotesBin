import * as React from 'react';
import FriendsNavBar from './nav_elements/FriendsNavBar.js';
import Navbar from './nav_elements/NavBar.js';

export default function Header(props) {
  return (
    <header className="App-header">
      <div className="nav-area">
        <FriendsNavBar />
      </div>
      <h1 className="App-title">{props.pageTitle}</h1>
      <img src={props.noteLogo} className="note-logo" alt="logo" />
      <img src={props.logoSrc} className="App-logo" alt="logo" />
      <Navbar />
    </header>
  );
}