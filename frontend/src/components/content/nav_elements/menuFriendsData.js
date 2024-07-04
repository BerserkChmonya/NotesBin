import React, { useEffect, useState } from 'react';
import FriendsService from "../../service/FriendsService";

// Assuming this is used in a React component or similar environment
export const useMenuItemsData = () => {
  const [menuItemsData, setMenuItemsData] = useState([
    {
      title: 'Friends',
      url: '',
      submenu: []
    }
  ]);

  useEffect(() => {
    const initMenuItemsData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      try {
        let friends = await FriendsService.getFriends(token, userId);

        setMenuItemsData(currentData => currentData.map(item => {
          if (item.title === 'Friends') {
            return {
              ...item,
              submenu: friends.map(friend => ({
                title: friend.name,
                url: `/friend?name=${friend.name}&id=${friend.id}`,
              }))
            };
          }
          return item;
        }));
      } catch (error) {
        console.error('Failed to load friends:', error);
      }
    };

    initMenuItemsData();
  }, []);

  return menuItemsData;
};