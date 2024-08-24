import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrf_token=')).split('=')[1];
            const response = await axios.post('/auth/register', {
                username,
                email,
                password,
                csrf_token: csrfToken
            });
            if (response.data.success) {
                history.push('/login');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md animate-slide-in">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 animate-fade-in">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
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
                        Register
                    </button>
                </form>
                <Link to="/" className="mt-4 block text-center text-indigo-500 hover:underline">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default Register;
