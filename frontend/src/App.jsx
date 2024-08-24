import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/homepage';
import Login from './components/login';
import Register from './components/register';
import LandingPage from './components/landingpage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/landing" element={<LandingPage/>} />
            </Routes>
        </Router>
    );
};

export default App;
