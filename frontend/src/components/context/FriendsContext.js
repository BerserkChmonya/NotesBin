// FriendsContext.js
import { createContext, useContext, useState } from 'react';

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);

    return (
        <FriendsContext.Provider value={{ friends, setFriends }}>
            {children}
        </FriendsContext.Provider>
    );
};

export const useFriends = () => useContext(FriendsContext);
