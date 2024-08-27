import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState(null);
    const navigate = useNavigate();

    // Fetch CSRF token when the component mounts
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/auth/csrf-token', { withCredentials: true });
                console.log('Response from CSRF token fetch:', response);
                setCsrfToken(response.data.csrf_token);
                console.log('Fetched CSRF Token:', response.data.csrf_token);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };
        fetchCsrfToken();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!csrfToken) {
            alert('CSRF Token is missing. Please refresh the page or try again later.');
            return;
        }
    
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
    
            console.log('Login response:', response);
    
            if (response.data && response.data.success) {
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    navigate('/landing');
                    document.body.classList.remove('fade-out');
                }, 500);
            } else {
                alert(response.data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert(error.response?.data?.error || 'An error occurred during login.');
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
