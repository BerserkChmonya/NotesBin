import { useState, useEffect } from 'react';
import UserService from '../service/UserService';

function UpdatePswdModal() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleModalToggle = () => setShowModal(!showModal);

    const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showModal]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleModalToggle();
        UserService.sendResetPasswordEmail(email);
        alert('Password reset instructions sent.');
    };

    return (
        <div style={{height: "100vh"}}>
            <button type="button"
                className="btn btn-link text-black-50 p-0"
                onClick={handleModalToggle}
                style={{ fontSize: 'medium' }}
            >
                Forgot Password
            </button>

            {showModal && (
                <div className="modal top fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true" data-mdb-backdrop="true" data-mdb-keyboard="true" style={{ display: 'block' }}>
                    <div className="modal-dialog" style={{ width: "300px" }}>
                        <div className="modal-content text-center">
                            <div className="modal-header h5 text-white bg-secondary justify-content-center">
                                Password Reset
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleModalToggle}></button>
                            </div>
                            <div className="modal-body px-5">
                                <p className="py-2">
                                    Enter your email address and we'll send you an email with instructions to reset your password.
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-outline">
                                        <input type="email" id="typeEmail" className="form-control my-3" onChange={handleEmailChange} required />
                                        <label className="form-label" htmlFor="typeEmail">Email</label>
                                    </div>
                                    <button type="submit" className="btn btn-secondary w-100">Reset password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdatePswdModal;