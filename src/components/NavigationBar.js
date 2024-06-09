import React from 'react';
import {NavLink} from 'react-router-dom';
import smallLogo from '../assets/smallLogo.svg';
import {logout} from "../state/userSlice";
import {useDispatch} from "react-redux";

const NavigationBar = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await dispatch(logout());
        } catch (error) {
            console.error('Ошибка при выходе', error);
        }
    };

    return (
        <nav className="nav-container">
            <ul className="nav-menu-left">
                <li><img src={smallLogo} alt="Логотип" className="logo" /></li>
            </ul>
            <div className="nav-content">
                <ul className="nav-menu-center">
                    <li><NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Рассылка</NavLink></li>
                    <li><NavLink to="/search" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Поиск</NavLink></li>
                    <li><NavLink to="/addressbooks" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Адресные книги</NavLink></li>
                    <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Админ-панель</NavLink></li>
                </ul>
            </div>
            <ul className="nav-menu-right">
                <li><a href="/login" onClick={handleLogout}>Выйти</a></li>
            </ul>
        </nav>
    );
};

export default NavigationBar;
