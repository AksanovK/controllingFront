import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
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
                    <li><Link to="/">Рассылка</Link></li>
                    <li><Link to="/search">Поиск</Link></li>
                    <li><Link to="/account">Личный кабинет</Link></li>
                    <li><Link to="/addressbooks">Адресные книги</Link></li>
                    <li><Link to="/admin">Админ</Link></li>
                </ul>
            </div>
            <ul className="nav-menu-right">
                <li><a href="/login" onClick={handleLogout}>Выйти</a></li>
            </ul>
        </nav>
    );
};

export default NavigationBar;
