import * as React from 'react';
import { useLocation } from 'react-router-dom';
import NoteService from '../service/NoteService';

function NotePage() {
    const location = useLocation();
    const [isError, setIsError] = React.useState(false);
    const [note, setNote] = React.useState(null);

    const link = location.state.link;
    const title = location.state.title;
    const content = location.state.content;

    const fetchNote = async (link) => {
        try {
            if (title && content) {
                setNote({
                    title: title,
                    content: content
                });
                return;
            }
            const token = localStorage.getItem('token');
            const response = await NoteService.getNote(link, token);
            if (!response || response === null || response === "") {
                setIsError(true);
                return;
            }
            setNote(response);
            setIsError(false);
        } catch (error) {
            setIsError(true);
            console.error('Error fetching notes:', error);
        }
    }

    React.useEffect(() => {
        fetchNote(link);
    }, [link]);

    return (
        <div style={{height: "100vh"}}>
            {isError ? (
                <h1>Wrong link</h1>
            ) : note ? (
                <div style={{wordWrap: "break-word", overflowWrap: "break-word", maxWidth: "100%"}}>
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>   
    );
}

export default NotePage;