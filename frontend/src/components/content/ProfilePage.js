import { useState, useEffect, useRef } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import NoteService from '../service/NoteService';
import FriendsService from '../service/FriendsService';
import { useFriends } from '../context/FriendsContext';
import './animations/streamer.css';

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    const contentRef = useRef(null);
    const [textareaText, setTextareaText] = useState(""); 
    const [friendRequests, setFriendRequests] = useState([]); 
    const { friends, setFriends } = useFriends();
    const [animate, setAnimate] = useState(null);

    const toggleContent = () => {
        setShowContent(!showContent);
        setTextareaText('');
    };

    const handleClickOutside = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
            setShowContent(false);
        }
    };

    const handleTextareaChange = (event) => {
        setTextareaText(event.target.value); // Update state with new textarea text
    };

    const fetchSendFriendRequest = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            await FriendsService.sendFriendRequest(token, userId, friendId);
            return true;
        } catch (error) {
            console.error('Error sending friend request:', error);
            return false;
        }
    };

    const handleKeyPress = async (event) => {
        // Check if 'Enter' was pressed without the shift key, or adjust according to your needs
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevents the default action of inserting a new line
            const searchedFriendElement = document.getElementById('searched-friend');
            if (searchedFriendElement) {
                if (friends.find(friend => friend.name === textareaText)) {
                    searchedFriendElement.textContent = "You are already friends with " + textareaText;
                    return;
                }
                if (textareaText === profileInfo.name) {
                    searchedFriendElement.textContent = "You can't send request to yourself";
                    return;
                }
                const responseOk = await fetchSendFriendRequest(textareaText);
                if (responseOk) {
                    searchedFriendElement.textContent =  ((textareaText !== "") ? "You have sent requst to ": "") + textareaText;
                    setTextareaText('');
                } else {
                    searchedFriendElement.textContent = "This user doesn't exist";
                }
            }
        }
    };

    const fetchNotes = async (userId, token) => {
        try {
            const response = await NoteService.getYourNotes(token, userId);
            response.sort((a, b) => new Date(b.note.createdDate) - new Date(a.note.createdDate));
            setNotes(response.map(({note, content}) => ({
                note: note,
                content: content
            })));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }; 

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.user);
            fetchNotes(response.user.id, token);
            fetchFriendRequests(token, response.user.id);
            localStorage.setItem('userId', response.user.id);
            try{
                const updatedFriends = await FriendsService.getFriends(token, response.user.id);
                setFriends(updatedFriends);
            } catch(err){
                console.error('Error fetching friends:', err);
            }
        } catch (error) {
            navigate('/'); 
            console.error('Error fetching profile information:', error);
        }
    };   

    const fetchFriendRequests = async (token, userId) => {
        try {
            const response = await FriendsService.getFriendRequests(token, userId);
            setFriendRequests(response.map(({id, name}) => ({
                id: id,
                name: name
            })
            ));
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };
    
    useEffect(() => {
        fetchProfile();
        localStorage.removeItem('content'); 
        localStorage.removeItem('title');

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNoteClick = (note) => {
        navigate('/page', { state: { content: note.content, title: note.note.title, link: note.note.link, isPrivate: note.note.private} });
    };

    // Handler to remove a friend request
    const handleRemoveFriendRequest = (userId) => {
        const updatedFriendRequests = friendRequests.filter(user => user.id !== userId);
        setFriendRequests(updatedFriendRequests);
    };

    const fetchAcceptFriendRequest = async (friendId) => {
        try{
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            await FriendsService.acceptFriendRequest(token, userId, friendId);
            
            // Fetch the updated friends list and update the context
            try{
                const updatedFriends = await FriendsService.getFriends(token, userId);
                setFriends(updatedFriends);
            } catch(err){
                console.error('Error fetching friends:', err);
            }
        } catch(err){
            console.error('Error accepting friend request:', err);
        }
    }

    const fetchRejectFriendRequest = async (friendId) => {
        try{
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            await FriendsService.rejectFriendRequest(token, userId, friendId);
        } catch(err){
            console.error('Error rejecting friend request:', err);
        }
    }

    const handleButtonClick = (event, action, userId) => {
        event.preventDefault();

        setAnimate(action);
        setTimeout(() => {
            setAnimate(null);
            if (action === 'accept') {
                handleRemoveFriendRequest(userId);
                fetchAcceptFriendRequest(userId);
            } else {
                handleRemoveFriendRequest(userId);
                fetchRejectFriendRequest(userId);
            }
        }, 300);
    };

    return (
        <div className="page-content">
            <div className="d-flex justify-content-center">
                <p style={{ marginRight: "10px" }}><strong> Name: {profileInfo.name} </strong> </p>
                <p style={{ marginLeft: "10px" }}><strong> Email: {profileInfo.email} </strong></p>
            </div>
            <div className='notes-container'>
                {notes.length > 0 ? (
                    notes.map((note, index) => (
                        note.note ? 
                        <button key={index} onClick={() => handleNoteClick(note)} className="note-button">
                            {note.note.title}
                        </button> : null
                    ))
                ) : (
                    <h5>You don't have notes yet...</h5>
                )}
                </div>
            <div className='add-btn-container' style={{position: "fixed", bottom: '20px', right: '20px', width: "100vw"}}>
                {!showContent && (
                    <button className='save-button request-button' onClick={toggleContent}>Requests</button>
                )}
                {showContent && (
                    <div ref={contentRef} className="content-div" style={{ width:"350px", background: "white", marginLeft: "60px", borderRadius: "8px"}}>
                        <textarea
                            value={textareaText}
                            placeholder="Type here..."
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyPress}
                            style={{width: "100%", 
                                whiteSpace: "nowrap",
                                overflowX: "hidden",
                                overflowY: "hidden",
                                resize: "none",
                                maxHeight: "42px",}}
                        ></textarea>
                        <div id='searched-friend'> 
                            {/* searched friend */}
                        </div>
                        <div id='request-div'style={{padding: "5px"}}>
                        {
                            friendRequests.length === 0 ? <p>No friend requests</p> : 
                            friendRequests.map((request, index) => (
                                <div key={index} style={{display: "flex", justifyContent: "space-between"}}>
                                    <p style={{marginLeft: "10px"}}><strong>{request.name}</strong> is applying</p>
                                    <div>
                                        <button className={`check-button confetti-button ${animate === 'accept' ? 'animate' : ''}`} style={{marginLeft: "20px"}} onClick={(event) => { handleButtonClick(event, 'accept', request.id); }}></button>
                                        <button className={`check-button delete-button confetti-button ${animate === 'reject' ? 'animate' : ''}`} onClick={(event) => { handleButtonClick(event, 'reject', request.id); }}></button>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                )}
                <button className='save-button' onClick={() => {navigate('/page'); localStorage.setItem('userId', profileInfo.id);}}>Add</button>
            </div>
        </div>
    );
}

export default ProfilePage;