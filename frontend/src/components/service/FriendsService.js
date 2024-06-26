import axios from "axios";

class FriendsService {
    static BASE_URL = 'http://localhost:8060/user/friends';

    static async getFriends(token, userId){
        try{
            const response = await axios.get(`${FriendsService.BASE_URL}/get-friends?user_id=${userId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async getFriendRequests(token, userId){
        try{
            const response = await axios.get(`${FriendsService.BASE_URL}/get-friend-requests?user_id=${userId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async acceptFriendRequest(token, userId, friendId){
        try{
            const response = await axios.put(`${FriendsService.BASE_URL}/accept-request?user1_id=${userId}&user2_id=${friendId}`,
            {},
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async rejectFriendRequest(token, userId, friendId){
        try{
            const response = await axios.delete(`${FriendsService.BASE_URL}/reject-request?user1_id=${userId}&user2_id=${friendId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async sendFriendRequest(token, userId, friendName){
        try{
            const response = await axios.post(`${FriendsService.BASE_URL}/send-request?user1_id=${userId}&friendName=${friendName}`,
            {},
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;

        }catch(err){
            throw err;
        }
    }
}

export default FriendsService;