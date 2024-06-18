import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NoteService from '../service/NoteService';

function ContentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const isNew = location.state === null;
    const [text, setText] = useState(isNew ? "" : localStorage.getItem('content') || location.state.content || '');
    const [title, setTitle] = useState(isNew ? "Untitiled" : localStorage.getItem('title') || location.state.title || 'Untitled');
    const [isEditingTitle, setIsEditingTitle] = useState(isNew);
    
    const link = isNew ? "" : location.state.link;
    const userId = localStorage.getItem('userId');


    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setIsEditingTitle(false);
        }
    };

    const handleSave = async () => {
        if (!isNew) {
            try {
                // Assuming you have a link and token to pass
                const token = localStorage.getItem('token');
                await NoteService.updateNoteContent(link, text, token);
                localStorage.setItem('content', text);
                alert('Note updated successfully');
            } catch (err) {
                console.error(err);
                alert('Failed to update note');
            }
        } else {
            // Here you can save the note to your backend
            const requestData = {
                note: {
                    title: title,
                    isPrivate: false,
                    user: {
                        id: userId
                    },
                },
                content: text
            };
            const token = localStorage.getItem('token');
            await NoteService.saveNote(requestData, token);
            navigate('/profile');
        }      
    };

    const handleTitleSave = async () => {
        setIsEditingTitle(false);
        // Here you can also save the title to your backend
        if (!isNew) {
            try{
                const token = localStorage.getItem('token');
                await NoteService.updateTitle(link, title, token);
                localStorage.setItem('title', title);
                alert('Note updated successfully');
            } catch (err) {
                console.error(err);
                alert('Failed to update title');
            }
        }   
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await NoteService.deleteNote(link, token);
            navigate('/profile'); // or wherever you want to redirect after deletion
        } catch (err) {
            console.error(err);
            alert('Failed to delete note');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            alert(`link: ${link} copied to clipboard`);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div style={{height: '100vh'}}> 
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", position: "relative"}}>
                {isEditingTitle ? (
                    <div>
                        <textarea autoFocus value={title} onChange={handleTitleChange} onKeyDown={handleKeyDown} style={{maxHeight: "40px", fontSize: "24px", minWidth: "300px", resize: "none"}}/>
                        <button onClick={handleTitleSave} className='save-button'
                        style={{ 
                            float: "none",
                            fontSize: '18px', 
                            padding: '5px 10px',
                            position: 'relative', 
                            top: '-12px', 
                            marginLeft: '10px'
                        }}
                        >Save</button>
                    </div>
                ) : (
                    <h1 onClick={() => setIsEditingTitle(true)}>{title}</h1>
                )}
                {!isNew && <button onClick={handleCopy} className='save-button copy-button'>Copy link</button>}
            </div>
            <textarea style={{width: '100%', height: '80%'}} value={text} onChange={handleChange} className='text-area'/>
            <div>
                {!isNew && <button onClick={handleDelete} className='save-button delete-button'>delete</button>}
                <button onClick={handleSave} className='save-button'>Save</button>
            </div>
        </div>
    );
}

export default ContentPage;