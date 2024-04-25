import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import CreateMailHeaderComponent from "../CreateMailHeaderComponent";
import CreateMailBodyComponent from "../CreateMailBodyComponent";
import axios from "axios";
import {useSelector} from "react-redux";
import {AxiosInit} from "../../utils/AxiosSettings";
import {MessengersConverter} from "../../utils/messengersConverter";

function CreateMailPage() {
    const location = useLocation();
    const { selectedIcon, selectedBook, isServiceAddress } = location.state;
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [animate, setAnimate] = useState(false);
    const creatorId = useSelector(state => state.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const messageData = {
            subject: subject,
            body: message,
            creatorId: creatorId,
            addressBookId: selectedBook.id,
            contactInfoType: MessengersConverter(selectedIcon),
            messageState: 'CREATED'
        };
        const response = await axios.post('/message/save',
            messageData,
            {withCredentials: true});
        if (response.status === 200) {
            console.log('Sending mail:', messageData);
            navigate('/');
        } else {
            console.log('error');
        }
    };

    const fixSubject = (subject) => {
        setSubject(subject.target.value);
    }

    const fixMessage = (event) => {
        setMessage(event.target.value);
    }

    const scrollToElementWithId = (id) => {
        setAnimate(false);
        setTimeout(() => {
            setAnimate(true);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            setTimeout(() => {
                setAnimate(false);
            }, 1000);
        }, 10);
    };

    return (
        <div className={"createMailDiv"}>
            <div className={"createMailHeaderDiv"}>
                <CreateMailHeaderComponent messenger={MessengersConverter(selectedIcon)} bookName={selectedBook.name} address={isServiceAddress}
                scrollMove={scrollToElementWithId}/>
            </div>
            <div className={"mailBodyDiv"}>
                <CreateMailBodyComponent fixMessage={fixMessage} fixSubject={fixSubject} selectedIcon={selectedIcon}
                                         handleSubmit={handleSubmit}/>
            </div>
        </div>
    );
}

export default CreateMailPage;
