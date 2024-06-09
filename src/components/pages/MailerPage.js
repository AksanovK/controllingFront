import React, {Suspense, useCallback, useEffect, useState} from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CommunicationVariantComponent from "../CommunicationVariantComponent";
import AddressBookSearchComponent from "../AddressBookSearchComponent";
import SendingModeChoiceComponent from "../SendingModeChoiceComponent";
import InstructionsReadyComponent from "../InstructionsReadyComponent";
import InfoBox from "../InfoBox";
//import MailerHeaderTitleComponent from "../MailerHeaderTitleComponent";
import CommunicationCascadeVariantComponent from "../CommunicationCascadeVariantComponent";
const MailerHeaderTitleComponent = React.lazy(() => import("../MailerHeaderTitleComponent"));

function MailerPage() {
    const [addressBooks , setAddressBooks] = useState([]);
    const [selectedMessengers, setSelectedMessengers] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [selectedBook, setSelectedBook] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isServiceAddress, setServiceAddress] = useState(true);
    const [isCascade, setCascade] = useState(false);
    const userId = useSelector(state => state.user.user);
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async function () {
            let instructionsData = await axios.get('/api/instructions/get', {
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
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            setTimeout(() => {
                setAnimate(false);
            }, 1000);
        }, 10);
    };

    const onNextPage = () => {
        if (selectedIcon && selectedBook && !isCascade) {
            navigate('/createMail', { state: { selectedIcon, selectedBook, isServiceAddress, isCascade, selectedMessengers } });
        } else if (isCascade && selectedMessengers && selectedBook) {
            navigate('/createMail', { state: { selectedIcon, selectedBook, isServiceAddress, isCascade, selectedMessengers } });
        } else {
            setError('Не все инструкции готовы');
        }
    };

    const handleImageClick = useCallback((alt) => {
        setSelectedIcon(alt);
        scrollToElementWithId("addressBooksSearchMotion")
    }, []);

    const handleNextClick = useCallback((variants) => {
        setSelectedMessengers(variants);
        scrollToElementWithId("addressBooksSearchMotion");
    }, []);

    const handleSetBook = useCallback((book) => {
        setSelectedBook({name: book.name, id: book.id});
        scrollToElementWithId("InstructionsReady");
    }, []);

    const handleHoverMode = useCallback((hoverText) => {
        if (hoverText !== "cascade") {
            setCascade(false);
            scrollToElementWithId("communicationVariantMotion");
        } else {
            setCascade(true);
            scrollToElementWithId("communicationCascadeVariantMotion");
        }
    }, []);

    return loading ? (
        <>
            <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </>
    ) : (
        <Suspense
            fallback={
                <>
                    <svg className="spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none"></circle>
                    </svg>
                </>
            }
        >
        <div className="mailerBackground">
            <div className="vectorPosition">
                <MailerHeaderTitleComponent handleSearch={() => scrollToElementWithId("SendingModeChoice")}/>
            </div>
            <div className={"sendingModeDiv"}>
                <SendingModeChoiceComponent handleHoverMode={handleHoverMode} />
            </div>
            {!isCascade ? <div className={"communicationVariant"}>
                <CommunicationVariantComponent handleImageClick={handleImageClick} />
            </div> : <div className={"communicationVariant"}>
                <CommunicationCascadeVariantComponent handleNextClick={handleNextClick} />
            </div>}
            <div className={"addressBooksSearch"}>
                <AddressBookSearchComponent addressBooks={addressBooks} handleSetBook={handleSetBook}/>
            </div>
            <div className={"addressBooksSearch"}>
                <InstructionsReadyComponent onNextPage={onNextPage} />
                {error && <InfoBox type="info" message={error} onClose={() => setError('')} />}
            </div>
        </div>
        </Suspense>
    );
}

export default MailerPage;
