import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import NoteService from '../service/NoteService';


function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
        localStorage.removeItem('content'); 
        localStorage.removeItem('title');
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            console.log('response:', response);
            setProfileInfo(response.user);
            fetchNotes(response.user.id, token);
        } catch (error) {
            navigate('/'); 
            console.error('Error fetching profile information:', error);
        }
    }; 

    const fetchNotes = async (userId, token) => {
        try {
            const response = await NoteService.getYourNotes(token, userId);
            console.log('response:', response);
            setNotes(response.map(({note, content}) => ({
                note: note,
                content: content
            })));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };    

    const handleNoteClick = (note) => {
        navigate('/page', { state: { content: note.content, title: note.note.title, link: note.note.link} });
    };

    return (
        <div className="page-content">
            <div className="d-flex justify-content-center">
                <p style={{ marginRight: "10px" }}><strong> Name: {profileInfo.name} </strong> </p>
                <p style={{ marginLeft: "10px" }}><strong> Email: {profileInfo.email} </strong></p>
            </div>
            <div className='notes-container'>
                {notes.map((note, index) => (
                    note.note ? 
                    <button key={index} onClick={() => handleNoteClick(note)} className="note-button">
                        {note.note.title}
                    </button> : null
                ))}
            </div>
            <div className='add-btn-container' style={{position: "fixed", bottom: '20px', right: '20px'}}>
                <button className='save-button' onClick={() => {navigate('/page'); localStorage.setItem('userId', profileInfo.id);}}>Add</button>
            </div>
        </div>
    );
}

export default ProfilePage;