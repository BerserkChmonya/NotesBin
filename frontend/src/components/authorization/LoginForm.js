import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import UserService from '../service/UserService';

function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [loginData, setLoginData] = useState({
        name: '',
        password: ''
    });
    const [regData, setRegData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleRegInputChange = (e) => {
        const { name, value } = e.target;
        setRegData({ ...regData, [name]: value });
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await UserService.login(loginData.name, loginData.password);
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                navigate('/profile');
            } else {
                setError(userData.message);
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoginData({ name: '', password: '' });
        }
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        try {
            await UserService.register(regData);
            setRegData({
                name: '',
                email: '',
                password: '',
                role: 'USER'
            });
            alert('User registered successfully');
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred while registering user');
        } finally {
            setRegData({
                name: '',
                email: '',
                password: '',
                role: 'USER'
            });
        }
    };

    return (
        <div className='row justify-content-center' style={{maxWidth: "90vh", margin: "0 auto", minHeight: "100vh"}}>
            <div className='col-4'>
                <ul className='nav nav-pills nav-justified mb-3' id='ex1' role='tablist'>
                    <li className='nav-item' role='presentation'>
                        <button
                            className={classNames('nav-link', { 'active': activeTab === 'login' })}
                            id='tab-login'
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </button>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <button
                            className={classNames('nav-link', { 'active': activeTab === 'register' })}
                            id='tab-register'
                            onClick={() => setActiveTab('register')}
                        >
                            Register
                        </button>
                    </li>
                </ul>

                <div className='tab-content'>
                    <div className={classNames('tab-pane', 'fade', { 'show active': activeTab === 'login' })} id='pills-login'>
                        <form onSubmit={handleSubmitLogin}>
                            <div className='form-outline mb-4'>
                                <input
                                    type='text'
                                    id='loginName'
                                    name='name'
                                    className='form-control'
                                    value={loginData.name}
                                    onChange={handleLoginInputChange}
                                    required
                                />
                                <label className='form-label' htmlFor='loginName'>Name</label>
                            </div>

                            <div className='form-outline mb-4'>
                                <input
                                    type='password'
                                    id='loginPassword'
                                    name='password'
                                    className='form-control'
                                    value={loginData.password}
                                    onChange={handleLoginInputChange}
                                    required
                                />
                                <label className='form-label' htmlFor='loginPassword'>Password</label>
                            </div>

                            {error && <p className='error-message'>{error}</p>}
                            <button type='submit' className='btn btn-primary btn-block mb-4'>Sign In</button>
                        </form>
                    </div>

                    <div className={classNames('tab-pane', 'fade', { 'show active': activeTab === 'register' })} id='pills-register'>
                        <form onSubmit={handleSubmitRegister}>
                            <div className='form-outline mb-4'>
                                <input
                                    type='text'
                                    id='registerName'
                                    name='name'
                                    className='form-control'
                                    value={regData.name}
                                    onChange={handleRegInputChange}
                                    required
                                />
                                <label className='form-label' htmlFor='registerName'>Name</label>
                            </div>

                            <div className='form-outline mb-4'>
                                <input
                                    type='email'
                                    id='registerEmail'
                                    name='email'
                                    className='form-control'
                                    value={regData.email}
                                    onChange={handleRegInputChange}
                                    required
                                />
                                <label className='form-label' htmlFor='registerEmail'>Email</label>
                            </div>

                            <div className='form-outline mb-4'>
                                <input
                                    type='password'
                                    id='registerPassword'
                                    name='password'
                                    className='form-control'
                                    value={regData.password}
                                    onChange={handleRegInputChange}
                                    required
                                />
                                <label className='form-label' htmlFor='registerPassword'>Password</label>
                            </div>

                            <button type='submit' className='btn btn-primary btn-block mb-4'>Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
