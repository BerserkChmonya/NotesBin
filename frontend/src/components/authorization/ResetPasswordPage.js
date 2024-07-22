import { useEffect, useState } from "react";
import UserService from "../service/UserService";

function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    UserService.logout();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');

    if (token) {
      setToken(token);
    } else {
      console.error("Error reseting password");
    }
  
  }, []);

  const resetPassword = async (password, token) => {
    try {
      const response = await UserService.resetPassword(token, password);
      setIsUpdated(true);
    } catch (error) {
      setError("Error reseting password");
      setTimeout(() => setError(''), 5000);
      console.error("Error reseting password: ", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password === repeatPassword) {
      resetPassword(password, token);
    } else {
      console.error("Passwords do not match.");
      setError("Passwords do not match.");
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="mt-5" style={{height: "100vh"}}>
      {isUpdated ? (
        <div>
          <div className="mx-auto alert alert-success" role="alert" style={{width: "50vh"}}>
            Password updated successfully
          </div>
          <a href="/">Return to login</a>
        </div>
      ) : token ? (
        <div className="mx-auto d-flex justify-content-center" style={{width: "40rem"}}>
          <div className="card login-form">
            <div className="card-body">
              <h3 className="card-title text-center">Change password</h3>
              
              {/* <!--Password must contain one lowercase letter, one number, and be at least 7 characters long.--> */}
              
              <div className="card-text">
                <form onSubmit={handleSubmit}>
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Holy Sh..!</strong> You should check in on some of those fields below.
          </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Your new password</label>
                    <input type="password" className="form-control form-control-sm" value={password} onChange={(e) => setPassword(e.target.value)} required minLength='4'/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Repeat password</label>
                    <input type="password" className="form-control form-control-sm" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required minLength='4'/>
                  </div>
                  {error && <p>{error}</p>}
                  <button type="submit" className="btn btn-primary btn-block submit-btn mt-3">Confirm</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Reset Password Page</h1>
      )}
    </div>
  );
}

export default ResetPasswordPage;