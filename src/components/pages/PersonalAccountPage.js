import React from 'react';
import { useSelector } from 'react-redux';

function PersonalAccountPage() {

    return (
        <div>
            <h1>Personal Account</h1>
            <div>
                <h3>Username: {'USER'}</h3>
                <p>Email: {'EMAIL'}</p>
            </div>
        </div>
    );
}

export default PersonalAccountPage;
