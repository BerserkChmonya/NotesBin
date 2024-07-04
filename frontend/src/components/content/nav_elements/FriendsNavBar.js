import { useMenuItemsData } from './menuFriendsData';
import MenuItems from './FriendsMenuItems';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserService from '../../service/UserService';
import { useFriends } from '../../context/FriendsContext';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const location = useLocation();
    const menuItemsData = useMenuItemsData();
    const { friends } = useFriends();

    useEffect(() => {
        setIsAuthenticated(UserService.isAuthenticated());
    }, [location]);

    const depthLevel = 0;

    const getFriendsSubmenu = (menu) => {
      if (friends.length > 0) {
          return friends.map(friend => ({
              title: friend.name,
              url: `/friend?name=${friend.name}&id=${friend.id}`,
          }));
      }
      // Fallback to initial menuItemsData if friends are empty
      const menuData = menuItemsData.find(item => item.title === 'Friends');
      return menuData ? menuData.submenu : [];
  };

    return (
        <nav className="desktop-nav">
          <ul className="menus">
          {isAuthenticated && menuItemsData.map((menu, index) => {
                    if (menu.title === 'Friends') {
                      return (
                        <MenuItems
                            items={{ ...menu, submenu: getFriendsSubmenu(menu) }}
                            key={index}
                            depthLevel={depthLevel}
                        />
                      );
                    }
                    return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
                })}
          </ul>
        </nav>
    );
};
  
  export default Navbar;