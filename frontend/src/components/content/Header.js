import { useLocation } from 'react-router-dom';
import FriendsNavBar from './nav_elements/FriendsNavBar.js';
import Navbar from './nav_elements/NavBar.js';

export default function Header(props) {
  const location = useLocation();
  const isRootPath = location.pathname === '/'; 

  const titleClass = `App-title ${isRootPath ? 'App-title show' : 'App-title hide'}`;
  const logoClass = `App-logo ${isRootPath ? 'App-logo show' : 'App-logo hide'}`;

  return (
    <header className="App-header">
      <div className="nav-area">
        <FriendsNavBar />
      </div>
      <h1 className={titleClass}>{props.pageTitle}</h1>
      <img src={props.noteLogo} className="note-logo" alt="logo" />
      <img src={props.logoSrc} className={logoClass} alt="logo" />
      <Navbar />
    </header>
  );
}