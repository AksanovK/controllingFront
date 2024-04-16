import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Outlet, Navigate} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import LoginPage from './components/LoginPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import MailerPage from "./components/MailerPage";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setCredentials} from "./state/userSlice";
import {AxiosInit} from "./utils/AxiosSettings";

function App() {
    const dispatch = useDispatch();
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');

    useEffect(() => {
        const accessTokenValue = localStorage.getItem('accessToken');
        const refreshTokenValue = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('user');
        const role = localStorage.getItem('role');

        if (accessTokenValue && refreshTokenValue && userId) {
            setAccessToken(accessTokenValue);
            setRefreshToken(refreshTokenValue);
            dispatch(setCredentials({
                accessToken,
                refreshToken,
                userId,
                role,
                isAuthenticated: true
            }));
            AxiosInit();
        }
    }, [dispatch]);

    axios.defaults.withCredentials = true;
    return <Router>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LayoutWithNav />}>
                <Route index element={<MailerPage />} />
            </Route>
        </Routes>
    </Router>;
}

function LayoutWithNav() {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    return (
        <div>
            <NavigationBar />
            {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </div>
    );
}

export default App;
