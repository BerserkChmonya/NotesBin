import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../../components/service/UserService';
import searchButtonImage from '../../../Search-Button-PNG-Free-Image.png';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [searchText, setSearchText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const toggleRef = useRef(null);

    useEffect(() => {
        setIsAuthenticated(UserService.isAuthenticated());

        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
            toggleRef.current && !toggleRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [location]);


    const handleLogout = (event) => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            setShowDropdown(false);
            UserService.logout();
            setIsAuthenticated(false);
            localStorage.removeItem('userId');
        } else {
            event.preventDefault();
        }
    };

    const handleSearch = () => {
        const button = document.querySelector('.search-button');
        button.classList.add('animate-compress');

        navigate('/note', {state: {link: searchText}});
        setSearchText('');

        setTimeout(() => {
            button.classList.remove('animate-compress');
        }, 200);
    };

    const handleKeyPress = (event) => {
        // Check if the Enter key was pressed
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default action to avoid form submission or newline
          handleSearch(); // Call the handleSearch function
        }
      };


    return (
        <nav className="navbar navbar-expand navbar-light nav-container">
            <div className="container-fluid">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {isAuthenticated && (
                        <li>
                            <textarea placeholder="Find by link:🔍" className="search-textarea mt-2" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyPress={handleKeyPress}/>
                            <button className="search-button mt-2" onClick={handleSearch}>
                                <img src={searchButtonImage} alt='Find' className='search-button-image'></img>
                            </button>
                        </li>
                    )}
                    {isAuthenticated && (
                        <li className="nav-item">
                            <Link to="/profile" className="nav-link text-white">Profile</Link>
                        </li>
                    )}
                    {isAuthenticated && (
                        <li className="nav-item">
                            <Link to="/" className="nav-link text-white" onClick={handleLogout}>Logout</Link>
                        </li>
                    )}
                
                    {isAuthenticated && (
                        <div className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)} ref={toggleRef}>
                        
                        </div>
                    )}

                    {showDropdown && (
                        <div className="dropdown-menu show shadow border rounded" ref={dropdownRef}>
                            <Link to="/profile" className="dropdown-item" onClick={() => {setShowDropdown(false);}}>Profile</Link>
                            <Link to="/" onClick={handleLogout} className="dropdown-item">Logout</Link>
                        </div>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;