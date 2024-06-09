import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import CreateMailHeaderComponent from "../CreateMailHeaderComponent";
import CreateMailBodyComponent from "../CreateMailBodyComponent";
import axios from "axios";
import {useSelector} from "react-redux";
import {MessengersConverter} from "../../utils/messengersConverter";
import {Mail, Search} from "react-feather";
import AcceptWindow from "../AcceptWindow";

function CreateMailPage() {
    const location = useLocation();
    const { selectedIcon, selectedBook, isServiceAddress, isCascade, selectedMessengers } = location.state;
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [animate, setAnimate] = useState(false);
    const creatorId = useSelector(state => state.user.user);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [modalBody, setModalBody] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log(selectedMessengers);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let response = {};
        if (!isCascade) {
            const messageData = {
                subject: subject,
                body: message,
                creatorId: creatorId,
                addressBookId: selectedBook.id,
                contactInfoType: MessengersConverter(selectedIcon),
                messageState: 'CREATED'
            };
            response = await axios.post('/api/message/save',
                messageData,
                {withCredentials: true});
        } else {
            const messageData = selectedMessengers.map(messenger => ({
                subject: subject,
                body: message,
                creatorId: creatorId,
                addressBookId: selectedBook.id,
                contactInfoType: MessengersConverter(messenger),
                messageState: 'CREATED'
            }));
            response = await axios.post('/api/message/send/cascade', messageData, { withCredentials: true });
        }

        if (response.status === 200) {
            setModalTitle('Отправка началась');
            setModalBody('Ваше сообщение успешно обработано');
            setOpen(true);
        } else {
            console.log('error');
            setModalTitle('Ошибка отправки');
            setModalBody('Во время обработки вашего сообщения возникли ошибки');
            setOpen(true);
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

    const onAccept = () => {
        navigate('/');
    }

    return (
        <div className={"createMailDiv"}>
            <div className={"createMailHeaderDiv"}>
                <CreateMailHeaderComponent messenger={MessengersConverter(selectedIcon)} bookName={selectedBook.name} address={isServiceAddress}
                                           isCascade={isCascade} selectedMessengers={selectedMessengers}/>
            </div>
            <div className={"mailBodyDiv"}>
                <CreateMailBodyComponent fixMessage={fixMessage} fixSubject={fixSubject} selectedIcon={selectedIcon}
                                         handleSubmit={handleSubmit}/>
            </div>
            <AcceptWindow open={open} onClose={onAccept}>
                <div className="text-center w-auto">
                    <Mail size={56} className="mx-auto text-white" />
                    <div className="mx-auto">
                        <h3 className="relative text-3xl font-black text-white mt-3 ">{modalTitle}</h3>
                        <p className="relative inter-font text-xl text-gray-200 mt-3 mb-4 ">
                            {modalBody}
                        </p>
                    </div>

                    <div className="flex gap-1">
                        <button
                            className="btn inter-font btn-dark w-full hover:bg-gray-200 hover:text-black"
                            onClick={onAccept}
                        >
                            Принять
                        </button>
                    </div>
                </div>
            </AcceptWindow>
        </div>
    );
}

export default CreateMailPage;
