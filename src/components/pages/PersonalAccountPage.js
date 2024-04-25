import React from 'react';
import { useSelector } from 'react-redux';
import AccountHeaderComponent from "../AccountHeaderComponent";

function PersonalAccountPage() {

    return (
        <div className={"personalAccountDiv"}>
            <div>
                <AccountHeaderComponent />
            </div>
        </div>
    );
}

export default PersonalAccountPage;
