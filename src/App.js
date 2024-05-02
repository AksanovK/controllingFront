import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Outlet,
    Navigate,
    useNavigate,
    useLocation,
    BrowserRouter
} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import LoginPage from './components/pages/LoginPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import MailerPage from "./components/pages/MailerPage";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setCredentials} from "./state/userSlice";
import {AxiosInit} from "./utils/AxiosSettings";
import CreateMailPage from "./components/pages/CreateMailPage";
import AddressBooksPage from "./components/pages/AddressBooksPage";
import PersonalAccountPage from "./components/pages/PersonalAccountPage";
import AdminPanelPage from "./components/pages/AdminPanelPage";
import SearchPage from "./components/pages/SearchPage";
import ContactPage from "./components/pages/ContactPage";
import InfoBox from "./components/InfoBox";

function App() {
    const dispatch = useDispatch();
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    useEffect(() => {
        const lastPath = localStorage.getItem('lastPath');
        const currentPath = location.pathname;
        console.log(currentPath + location.search);
        if (lastPath ?? isAuthenticated) {
            if (currentPath !== '/contact') {
                console.log(currentPath);
                navigate(lastPath);
            } else {
                navigate(currentPath + location.search);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('lastPath', location.pathname);
    }, [location]);

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
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LayoutWithNav />}>
                <Route index element={<MailerPage />} />
                <Route path="/createMail" element={<CreateMailPage />} />
                <Route path="/addressbooks" element={<AddressBooksPage />} />
                <Route path="/account" element={<PersonalAccountPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Route>
        </Routes>);
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
