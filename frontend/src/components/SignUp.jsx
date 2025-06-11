import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';


const SignUp = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/auth/register`, { username, email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user_id);
            setToken(response.data.token);
            navigate('/profile', {
                state: { user_id: response.data.user_id }
            });
            console.log('User signed up successfully:', response.data);
        } catch (error) {
            console.error('Error signing up:', error.response?.data || error.message);
        }
    };

    return (
        <div className="signup-container">
        <div className="signup-form">
            <div className="signup-title">
               Sign Up Now
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <div className="signup-links2">
                <p className="login-link2">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    </div>
    );
};

export default SignUp;


