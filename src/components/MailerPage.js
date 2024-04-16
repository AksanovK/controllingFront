import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import vkLogo from "../assets/vkicon.svg";
import wsLogo from "../assets/whatsicon.svg";
import tgLogo from "../assets/tgicon.svg";
import mailLogo from "../assets/mailicon.svg";
import mailArrow from '../assets/mailArrow.svg';
import {useNavigate} from "react-router-dom";

function MailerPage() {
    const [addressBooks , setAddressBooks] = useState([]);
   // const [messengers, setMessengers] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedBook, setSelectedBook] = useState('');
    const [loading, setLoading] = useState(true);
    const [isServiceAddress, setServiceAddress] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
                //setMessengers(instructionsData.data.messengers);
                setLoading(false);
            }
        })();
    }, []);

    const handleIconClick = (iconName) => {
        setSelectedIcon(iconName);
    };

    const handleSelectBook = (bookId) => {
        const selectedBook = addressBooks.find(book => book.id === bookId);

        if (selectedBook) {
            setSelectedBook(selectedBook.name);
        } else {
            setSelectedBook('');
        }

        setShowDropdown(false);
    };


    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setShowDropdown(value !== '');
        if (value === '') {
            setSelectedBook('');
        }
    };

    const filteredBooks = searchTerm ? addressBooks.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleServiceChoice = (event) => {
        setServiceAddress(true);
    };

    const handleUserChoice = (event) => {
        setServiceAddress(false);
    };

    const icons = [
        { src: vkLogo, alt: 'vkicon' },
        { src: wsLogo, alt: 'wsicon' },
        { src: tgLogo, alt: 'tgicon' },
        { src: mailLogo, alt: 'mailicon' }
    ];

    const scrollToForm = () => {
        // setTimeout(() => {
        //     document.getElementById('mailerForm').scrollIntoView({ behavior: 'smooth' });
        // }, 200);
        setAnimate(false);

        setTimeout(() => {
            setAnimate(true);

            document.getElementById('mailerForm').scrollIntoView({
                behavior: 'smooth'
            });

            setTimeout(() => {
                setAnimate(false);
            }, 1000);
        }, 10);
    };

    const handleNextPage = () => {
        navigate('/createMail');
    };

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
                <button onClick={scrollToForm} className="startButton">
                    Начать
                </button>
            </div>
            <div className="formSection">
                <form className={`mailerFormClass ${animate ? 'fadeIn' : ''}`} id="mailerForm">
                    <div className="form-group text-center">
                        <h2 className="instructionTitle">Выберите метод связи</h2>
                        <div className="icons-container">
                            {icons.map(icon => (
                                <img
                                    src={icon.src}
                                    alt={icon.alt}
                                    className={`communication-icon ${selectedIcon === icon.alt ? 'selected' : ''}`}
                                    onClick={() => handleIconClick(icon.alt)}
                                    style={{ transition: 'transform 0.3s', transform: selectedIcon === icon.alt ? 'scale(1.2)' : 'scale(1)' }}
                                />
                            ))}
                        </div>
                        <h2 className="instructionTitle">Выберите адресную книгу</h2>
                        <input
                            type="search"
                            className="form-control search-input"
                            placeholder="Поиск адресной книги"
                            onChange={handleSearchChange}
                        />
                        {showDropdown && searchTerm && (
                            <ul className="address-book-list">
                                {filteredBooks.map(book => (
                                    <li key={book.id}
                                        className="address-book-item"
                                        onClick={() => handleSelectBook(book.id)}>
                                        {book.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <h2 className="instructionAddressBookTitle">{selectedBook}</h2>
                        <h2 className="instructionTitle">Выберите режим отправки</h2>
                        <div className="d-flex justify-content-center mt-4">
                            <button type="button" className={`instructionChoiceServiceBut ${isServiceAddress ? 'active' : ''}`} onClick={handleServiceChoice}>Почта сервиса</button>
                            <button type="button" className={`instructionChoiceUserBut ${!isServiceAddress ? 'active' : ''}`} onClick={handleUserChoice}>Почта пользователя</button>
                        </div>
                        <button type="button" className="d-flex justify-content-center mt-4 instructionNextButton" onClick={handleNextPage}>Готово</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MailerPage;
