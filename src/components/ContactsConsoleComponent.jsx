import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React, {useEffect, useState} from "react";
import ImageRow from "./ImageRowComponent";
import axios from "axios";
import {Check, Trash2} from "react-feather";

export default function ContactsConsoleComponent({ selectedBook, books, bookName,
                                                     toggleContactSelection, acceptSelection, clearSelection, selectedContacts}) {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [contacts, setContacts] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPageCount, setMaxPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        (async function () {
            try {
                if (!isSearching) {
                    console.log("123");
                    setPage(1);
                    setLoading(true);
                    let contactsData = await axios.get('api/contacts/getContacts', {
                        params: {
                            bookId: selectedBook,
                            page: 0,
                            pageSize: 10
                        }
                    });
                    if (selectedBook === 0) {
                        contactsData.data.content = contactsData.data.content.map(contact => {
                            const book = books.find(book => book.id === contact.addressBookId);
                            return { ...contact, bookName: book ? book.name : bookName };
                        });
                    }
                    setContacts(contactsData.data.content);
                    setMaxPageCount(contactsData.data.totalPages);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Ошибка: ', error);
            }
        })();
    }, [selectedBook]);

    useEffect(() => {
        (async function () {
            try {
                if (!isSearching) {
                    console.log("1234");
                    setLoading(true);
                    let contactsData = await axios.get('api/contacts/getContacts', {
                        params: {
                            bookId: selectedBook,
                            page: page - 1,
                            pageSize: 10
                        }
                    });
                    if (selectedBook === 0) {
                        contactsData.data.content = contactsData.data.content.map(contact => {
                            const book = books.find(book => book.id === contact.addressBookId);
                            return { ...contact, bookName: book ? book.name : bookName };
                        });
                    }
                    setContacts(contactsData.data.content);
                    setMaxPageCount(contactsData.data.totalPages);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Ошибка: ', error);
            }
        })();
    }, [page]);

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    const handleLoadMore = () => {
        if (page + 1 <= maxPageCount) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleLoadPrevious = () => {
        if (page - 1 !== 0) {
            setPage(prevPage => prevPage - 1);
        }
    };

    const handleSearchChange = event => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const triggerSearch = async () => {
        if (searchQuery.length !== 0) {
            try {
                setIsSearching(true);
                setPage(1);
                setLoading(true);
                let contactsData = await axios.get('api/contacts/searchContacts', {
                    params: {
                        bookId: selectedBook,
                        page: 0,
                        pageSize: 10,
                        searchQuery: searchQuery
                    }
                });
                console.log("Received data:", contactsData);
                if (selectedBook === 0) {
                    contactsData.data.content = contactsData.data.content.map(contact => {
                        const book = books.find(book => book.id === contact.addressBookId);
                        return {...contact, bookName: book ? book.name : bookName};
                    });
                }
                setContacts(contactsData.data.content);
                setMaxPageCount(contactsData.data.totalPages);
                setLoading(false);
                setIsSearching(false);
            } catch (error) {
                console.error('Ошибка при запросе:', error);
                setIsSearching(false);
            }
        }
    };

    return (
        <motion.div
            id={"consoleContactsId"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={"h-full flex-grow p-4"}
        >
            <div className="flex-grow console-contacts-root p-4 h-screen rounded-lg">
                <div className="terminal rounded-lg">
                    <div className="terminal-header p-3 flex justify-between items-center rounded-lg">
                        <span>Контакты</span>
                        <div className={"justify-center align-content-center text-center flex"}>
                            <span className={"mr-5"}>{selectedContacts.size}</span>
                            <button onClick={acceptSelection} className="mr-5 text-green-500 hover:bg-green-300 inter-font"><Check size={24}/></button>
                            <button onClick={clearSelection} className="text-red-500 inter-font"><Trash2 size={20}/></button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="spinner-container">
                            <svg className="spinner" viewBox="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                        </div>
                    ) : (
                        <div className="terminal-body inter-font-thin rounded-lg">
                            <div className="search-container flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Поиск контактов..."
                                    className="search-input text-black inter-font-thin rounded-lg flex-grow"
                                    onChange={handleSearchChange}
                                    value={searchQuery}
                                />
                                <button
                                    onClick={triggerSearch}
                                    className="inter-font-bold search-button bg-gray-50 hover:bg-gray-400 text-black py-2 px-4 rounded"
                                >
                                    Поиск
                                </button>
                            </div>
                            <div style={{ flex: 1, overflow: 'auto' }}>
                                <table className="terminal-table inter-font">
                                    <thead className={"text-center"}>
                                    <tr>
                                        <th>Имя и фамилия</th>
                                        <th>Адресная книга</th>
                                        <th>Почта</th>
                                        <th>Telegram</th>
                                        <th>VK</th>
                                        <th>WhatsApp</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {contacts.map(contact => (
                                        <tr
                                            key={contact.id + "_contact"}
                                            className={`terminal-line ${selectedContacts.has(contact) ? "rounded-lg bg-gray-300 text-black" : ""}`}
                                            onClick={() => toggleContactSelection(contact)}
                                        >
                                            <td>{contact.firstName} {contact.lastName}</td>
                                            <td>{contact.bookName || bookName}</td>
                                            {contact.contactInfo.map((info, index) => (
                                                <td key={info.contactId}>
                                                    {info.type === 'VK' ? 'https://vk.com/' + info.value : info.value}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination-controls rounded-lg p-3 inter-font-bold">
                                <p>
                                    Страница {page} / {maxPageCount}
                                </p>
                                <div>
                                    <button className={"mr-2"} onClick={handleLoadPrevious} disabled={page === 1 || loading}>
                                        Предыдущая
                                    </button>
                                    <button onClick={handleLoadMore} disabled={page === maxPageCount || loading}>
                                        Следующая
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
