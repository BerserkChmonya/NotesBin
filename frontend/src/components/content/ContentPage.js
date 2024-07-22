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
    const [isPrivate, setIsPrivate] = useState(isNew? false: location.state.isPrivate);
    const [privateChange, setPrivateChange] = useState(!isNew && location.state.isPrivate);
    
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
                if (privateChange !== isPrivate) {
                    try {
                        await NoteService.updatePrivacy(link, privateChange, token);
                    } catch (err) {
                        console.error('Failed to update privacy: ', err);
                    }
                    setIsPrivate(privateChange);
                }

                if (text !== localStorage.getItem('content')) {
                    await NoteService.updateNoteContent(link, text, token);
                    localStorage.setItem('content', text);
                    alert('Note updated successfully');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to update note');
            }
        } else {
            // save the note to the backend
            const requestData = {
                note: {
                    title: title,
                    private: isPrivate,
                    user: {
                        id: userId
                    },
                },
                content: text
            };
            const token = localStorage.getItem('token');
            try{
                await NoteService.saveNote(requestData, token);
            } catch (err) {
                console.error(err);
            }
            navigate('/profile');
        }      
    };

    const handleTitleSave = async () => {
        setIsEditingTitle(false);
        // Here you can also save the title to your backend
        if (!isNew && title !== localStorage.getItem('title')) {
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

    const handlePrivateCheckChange = (event) => {
        isNew? setIsPrivate(event.target.checked): setPrivateChange(event.target.checked);
    };

    const handleKeyTitle = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default action (newline)
          handleTitleSave(); // Call the handleTitleSave function
        }
      };

    return (
        <div style={{height: '100vh'}}> 
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", position: "relative"}}>
                {!isNew && 
                <div className="checkbox-wrapper-8">
                    <input className="tgl tgl-skewed" id="cb3-8" type="checkbox" onChange={handlePrivateCheckChange} checked={privateChange} />
                    <label className="tgl-btn" data-tg-off="Unprivate" data-tg-on="Private" htmlFor="cb3-8"/>
                </div>}
                {isEditingTitle ? (
                    <div>
                        <textarea className='mb-1' onKeyPress={handleKeyTitle}  autoFocus value={title} onChange={handleTitleChange} onKeyDown={handleKeyDown} style={{maxHeight: "40px", fontSize: "24px", minWidth: "300px", resize: "none"}}/>
                        <button onClick={handleTitleSave} className='save-button shadow-sm'
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
                
                {!isNew && <button onClick={handleCopy} className='save-button copy-button shadow-sm'>Copy link</button>}
            </div>
            <textarea style={{width: '100%', height: '80%'}} value={text} onChange={handleChange} className='text-area'/>
            <div>
                {isNew &&
                    <div className="privateChecker">
                    <input
                      type="checkbox"
                      id="privateCheck"
                      name="privateCheck"
                      value="private"
                      onChange={handlePrivateCheckChange} // Assuming you have a method to handle the change
                        style={{transform: "scale(1.5)"}}
                    />
                    <label htmlFor="privateCheck" style={{marginLeft: "5px", fontWeight: (isPrivate)? "bold": ""}}>Private</label>
                  </div>
                }
                {!isNew && <button onClick={handleDelete} className='save-button delete-button shadow-sm'>delete</button>}
                <button onClick={handleSave} className='save-button shadow'>Save</button>
            </div>
        </div>
    );
}

export default ContentPage;