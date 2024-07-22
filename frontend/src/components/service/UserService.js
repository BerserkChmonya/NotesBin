import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8000";

    static async login(name, password){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {name, password})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData)
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static async verifyEmail(token){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/verify?token=${token}`)
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async sendResetPasswordEmail(email){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/reset-password?email=${email}`)
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async resetPassword(token, password){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/auth/reset`, null,
                {
                    params: {token: token, password: password}
                }
            )
            return response.data;
        }catch(err){
            throw err;
        }
    }
}

export default UserService;