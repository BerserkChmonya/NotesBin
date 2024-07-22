import axios from "axios";

class NoteService {
    static BASE_URL = "http://localhost:8020/user/notes";

    static async getYourNotes(token, userId){
        try{
            const response = await axios.get(`${NoteService.BASE_URL}/get-notes?userId=${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getFriendNotes(token, userId){
        try{
            const response = await axios.get(`${NoteService.BASE_URL}/get-titled?userId=${userId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
 
    static async saveNote(requestData, token){
        try{
            const response = await axios.post(`${NoteService.BASE_URL}/save`, requestData, {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async deleteNote(link, token){
        try{
            const response = await axios.post(`${NoteService.BASE_URL}/delete?link=${encodeURIComponent(link)}`, {},
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async updateNoteContent(link, content, token){
        try{
            const response = await axios.put(`${NoteService.BASE_URL}/update`, {link: link, content: content}, {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async updateTitle(link, title, token){
        try{
            const response = await axios.put(`${NoteService.BASE_URL}/update-title`, null, {
                params: {link: link, title: title},
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async getNote(link, token) {
        try {
            const response = await axios.get(`${NoteService.BASE_URL}/get-note?link=${link}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updatePrivacy(link, isPrivate, token){
        try{
            const response = await axios.put(`${NoteService.BASE_URL}/update-privacy`, null, {
                params: {link: link, isPrivate: isPrivate},
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

}

export default NoteService;