import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import vkLogo from "../../assets/vkicon.svg";
import wsLogo from "../../assets/whatsicon.svg";
import tgLogo from "../../assets/tgicon.svg";
import mailLogo from "../../assets/mailicon.svg";
import {useNavigate} from "react-router-dom";
import CommunicationVariantComponent from "../CommunicationVariantComponent";
import AddressBookSearchComponent from "../AddressBookSearchComponent";
import SendingModeChoiceComponent from "../SendingModeChoiceComponent";
import InstructionsReadyComponent from "../InstructionsReadyComponent";
import InfoBox from "../InfoBox";

function MailerPage() {
    const [addressBooks , setAddressBooks] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [selectedBook, setSelectedBook] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isServiceAddress, setServiceAddress] = useState(true);
    const userId = useSelector(state => state.user.user);
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async function () {
            let instructionsData = await axios.get('/instructions/get', {
                params: {
                    userId: userId
                }
            });
            if (instructionsData) {
                setAddressBooks(instructionsData.data.books);
                setLoading(false);
            }
        })();
    }, []);

    const scrollToElementWithId = (id) => {
        setAnimate(false);
        setTimeout(() => {
            setAnimate(true);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            setTimeout(() => {
                setAnimate(false);
            }, 1000);
        }, 10);
    };

    const onNextPage = () => {
        if (selectedIcon && selectedBook) {
            navigate('/createMail', { state: { selectedIcon, selectedBook, isServiceAddress } });
        } else {
            setError('Не все инструкции готовы');
        }
    };

    const handleImageClick = useCallback((alt) => {
        setSelectedIcon(alt);
        scrollToElementWithId("addressBooksSearchMotion")
    }, []);

    const handleSetBook = useCallback((book) => {
        setSelectedBook(book);
        scrollToElementWithId("SendingModeChoice");
    }, []);

    const handleHoverMode = useCallback((hoverText) => {
        setServiceAddress(hoverText === "service");
        scrollToElementWithId("InstructionsReady");
    }, []);

    return loading ? (
        <>
            <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </>
    ) : (
        <div className="mailerBackground">
            <div className="vectorPosition">
                <p className="mailerTitle">Создать новую<br/> рассылку</p>
                <button onClick={() => scrollToElementWithId("communicationVariantMotion")} className="startButton">
                    Начать
                </button>
            </div>
            <div className={"communicationVariant"}>
                <CommunicationVariantComponent handleImageClick={handleImageClick} />
            </div>
            <div className={"addressBooksSearch"}>
                <AddressBookSearchComponent addressBooks={addressBooks} handleSetBook={handleSetBook}/>
            </div>
            <div className={"sendingModeDiv"}>
                <SendingModeChoiceComponent handleHoverMode={handleHoverMode} />
            </div>
            <div className={"addressBooksSearch"}>
                <InstructionsReadyComponent onNextPage={onNextPage} />
                {error && <InfoBox type="info" message={error} onClose={() => setError('')} />}
            </div>
        </div>
    );
}

export default MailerPage;
