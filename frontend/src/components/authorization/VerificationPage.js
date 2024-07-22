import { useEffect, useState } from "react";
import UserService from "../service/UserService";


function VerificationPage() {
    const[token, setToken] = useState(null);
    const [verified, setVerified] = useState(false);

    const fetchVerification = async (token) => {
        try {
            const response = await UserService.verifyEmail(token);
            setVerified(response);
        } catch (error) {
            console.error("Error verifying email: ", error);
        }
    };

    useEffect(() => {
        UserService.logout();
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');
        
        if (token) {
            setToken(token);
            fetchVerification(token);
        } else {
            console.error("Token not found in the URL");
        }
    }, []);
  
    return (
        <div className="container" style={{height: "100vh"}}>
            <div className="card mx-auto mt-5" style={{width: "25rem"}}>
                <div className="card-body p-4">
                    <h1 className="card-title">Verification</h1>
                    {!token ? (
                        <h5 className="p-2">Verify your email</h5>
                    ) : 
                    verified ? (
                        <div>
                            <h5 className="p-2">Email verified</h5>
                            <a href="/">return to login</a>
                        </div>
                    ) : (
                        <h5 className="p-2">Something went wrong...</h5>
                    )}
                </div>
            </div>
        </div>
  );
}

export default VerificationPage;