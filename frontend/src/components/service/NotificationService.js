import axios from "axios";

class NotificationService {
    static BASE_URL = "http://localhost:8090/notifications";

    static async getNotifications(userId, token){
        try{
            const response = await axios.get(`${NotificationService.BASE_URL}/unseen/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async markAsSeen(notificationId, token){
        try{
            const response = await axios.put(`${NotificationService.BASE_URL}/mark/${notificationId}`, null,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }
}

export default NotificationService;