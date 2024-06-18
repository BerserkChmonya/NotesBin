import { menuItemsData } from './menuFriendsData';
import MenuItems from './FriendsMenuItems';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserService from '../../service/UserService';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const location = useLocation();

    useEffect(() => {
        setIsAuthenticated(UserService.isAuthenticated());
    }, [location]);

    const depthLevel = 0;

    return (
        <nav className="desktop-nav">
          <ul className="menus">
          {isAuthenticated && menuItemsData.map((menu, index) => {
            return <MenuItems items={menu} key={index} depthLevel={depthLevel}/>;
          })}
          </ul>
        </nav>
    );
};
  
  export default Navbar;