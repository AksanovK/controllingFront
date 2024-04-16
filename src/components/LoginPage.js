import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import bigLogo from '../assets/LOGObig.png';
import { ReactComponent as Vector } from '../assets/vectorsLogin.svg';
import {useDispatch, useSelector} from "react-redux";
import {clearError, loginUser, logout} from "../state/userSlice";
import InfoBox from "./InfoBox";
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);
    const error = useSelector(state => state.user.error);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (<div>
        {isAuthenticated ? (
            <button onClick={() => dispatch(logout())}>Logout</button>
            ) : (
                <div>
                    {error && <InfoBox type="error" message={error} onClose={() => dispatch(clearError())} />}
                    <div className="loginContainer">
                        <img src={bigLogo} className="App-logo" alt="logo" />
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="inputEmail">Email</label>
                                <input id="inputEmail" placeholder="Email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputPassword" >Password</label>
                                <input id="inputPassword" placeholder="Password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Войти</button>
                        </form>
                    </div>
                    <div className="vectorLoginContainer">
                        <Vector />
                    </div>
                </div>)}
        </div>
    );
}

export default LoginPage;
