import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Utility function to get CSRF token from cookies
const getCSRFToken = () => {
    const name = 'csrf_token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name)) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
};

const Login = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const csrfToken = getCSRFToken();
        console.log('Retrieved CSRF Token:', csrfToken);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
                email,
                password
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.data.success) {
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    history.push('/');
                    document.body.classList.remove('fade-out');
                }, 500);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md animate-slide-in">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 animate-fade-in">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600 transition duration-300 ease-in-out">
                        Login
                    </button>
                </form>
                <Link to="/" className="mt-4 block text-center text-indigo-500 hover:underline">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default Login;
