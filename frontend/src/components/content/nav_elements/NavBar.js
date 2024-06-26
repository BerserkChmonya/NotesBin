import { useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../../components/service/UserService';
import searchButtonImage from '../../../Search-Button-PNG-Free-Image.png';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [searchText, setSearchText] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuthenticated(UserService.isAuthenticated());
    }, [location]);


    const handleLogout = (event) => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
            setIsAuthenticated(false);
            localStorage.removeItem('userId');
        } else {
            event.preventDefault();
        }
    };

    const handleSearch = () => {
        navigate('/note', {state: {link: searchText}});
        setSearchText('');
    };


    return (
        <nav className="navbar navbar-expand navbar-light" style={{fontSize: '1.3rem', width: "50%", display: "flex", justifyContent: "flex-end", right: 0, position: "absolute"}}>
            <div className="container-fluid">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {isAuthenticated && (
                        <li>
                            <textarea placeholder="Find by link:🔍" className="search-textarea" value={searchText} onChange={e => setSearchText(e.target.value)}/>
                            <button className="search-button" onClick={handleSearch}>
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
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;