import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NoteService from "../service/NoteService";
import FriendsService from "../service/FriendsService";
import { useFriends } from '../context/FriendsContext';

function FriendPage() {
    const [notes, setNotes] = useState([]); 
    const location = useLocation();
    const navigate = useNavigate();
    const { friends, setFriends } = useFriends();

    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get('name');
    const id = queryParams.get('id');

    const fetchNotes = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await NoteService.getFriendNotes(token, userId);
            console.log('response:', response);
            response.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setNotes(response.map(({title, content}) => ({
                title: title,
                content: content
            })));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes(id);
    }, []);

    const handleNoteClick = (note) => {
        navigate('/note', { state: { content: note.content, title: note.title} });
    };

    const handleDeleteFriend = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            await FriendsService.rejectFriendRequest(token, userId, id);
            navigate('/profile');
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    }

    return (
        <div className="page-content">
            <div className="d-flex justify-content-center">
                <h3 style={{ marginRight: "10px" }}><strong> {name} </strong> </h3>
            </div>
            <div className='notes-container'>
                {notes.length > 0 ? (
                    notes.map((note, index) => (
                        note ? 
                        <button key={index} onClick={() => handleNoteClick(note)} className="note-button">
                            {note.title}
                        </button> : null
                    ))
                ) : (
                    <h5>{name} doens't have notes yet...</h5>
                )}
            </div>
            <div className='add-btn-container' style={{position: "fixed", bottom: '20px', right: '20px', width: "100vw"}}>
                <button className='save-button request-button' onClick={() => handleDeleteFriend()} style={{backgroundColor: "red", padding: "4px 10px"}}>Delete friend</button>
            </div>
        </div>
    )
}

export default FriendPage;