import React, { useEffect, useState } from "react";
import axios from "axios";
import { Book, BookOpen } from "react-feather";
import { FaTrash, FaEdit } from "react-icons/fa";
import ContactsConsoleComponent from "../ContactsConsoleComponent";
import SelectedContactsComponent from "../SelectedContactsComponent";
import AddressBooksHeaderComponent from "../AddressBooksHeaderComponent";

function ContactsMgtPage() {
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const userId = localStorage.getItem('user');
    const [selectedBook, setSelectedBook] = useState({});
    const [selectedContacts, setSelectedContacts] = useState(new Set());
    const [showUpload, setShowUpload] = useState(false);
    const [showRename, setShowRename] = useState(false);
    const [file, setFile] = useState(null);
    const [newBookName, setNewBookName] = useState("");
    const [selectedBookForRename, setSelectedBookForRename] = useState({});

    useEffect(() => {
        (async function () {
            try {
                let booksData = await axios.get('/api/addressBooks/getListOfBooks', {
                    params: {
                        userId: userId
                    }
                });
                if (booksData) {
                    const allContactsBook = { id: 0, name: "Все контакты", isOpen: false };
                    const updatedBooksData = [allContactsBook, ...booksData.data.map(book => ({ ...book, isOpen: false }))];
                    setBooks(updatedBooksData);
                    setSelectedBook(updatedBooksData[0]);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Ошибка: ', error);
            }
        })();
    }, []);

    const [animate, setAnimate] = useState(false);

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

    const toggleContactSelection = contact => {
        setSelectedContacts(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(contact)) {
                newSelected.delete(contact);
            } else {
                newSelected.add(contact);
            }
            return newSelected;
        });
    };

    const acceptSelection = () => {
        scrollToElementWithId("selectedContactsPanelId");
    }

    const clearSelection = () => {
        setSelectedContacts(new Set());
    };

    const toggleGroup = (index) => {
        const newBooks = books.map((book, idx) =>
            idx === index ? { ...book, isOpen: !book.isOpen } : book
        );
        setBooks(newBooks);
        setSelectedBook(books[index]);
    };

    const addBook = () => {
        setShowUpload(true);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!file) {
            alert("Пожалуйста, выберите файл для загрузки.");
            return;
        }

        const fileName = file.name;
        if (!fileName.endsWith(".csv")) {
            alert("Файл должен быть формата CSV.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        axios.post("/api/addressBooks/addAddressBook", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                window.location.reload();
                console.log("Файл успешно загружен:", response.data);
                setShowUpload(false);
            })
            .catch(error => {
                console.error("Ошибка при загрузке файла:", error);
                alert("Ошибка при загрузке файла. Проверьте консоль для деталей.");
                window.location.reload();
            });

        setShowUpload(false);
    };

    const deleteBook = async (bookId) => {
        if (bookId !== 0) {
            setLoading(true);
            try {
                const response = await axios.post("/api/addressBooks/deleteAddressBook", null, {
                    params: { bookId }
                });
                if (response.status === 200) {
                    console.log("Книга успешно удалена");
                    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
                    setSelectedBook(books[0]);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error("Ошибка при удалении книги:", error);
                alert("Ошибка при удалении книги. Проверьте консоль для деталей.");
            }
            console.log("Deleting book with id:", bookId);
        } else {
            alert("Данную книгу нельзя удалить.");
        }
    };

    const renameBook = (bookId) => {
       // setSelectedBook(books.find(book => book.id === bookId));
        setSelectedBookForRename(books.find(book => book.id === bookId));
        setShowRename(true);
    };

    const handleRenameChange = (event) => {
        setNewBookName(event.target.value);
    };

    const handleRenameSubmit = async () => {
        if (newBookName.trim() === "") {
            alert("Название книги не может быть пустым.");
            return;
        }

        try {
            setLoading(true);
            setShowRename(false);
            const response = await axios.post("/api/addressBooks/renameAddressBook", null, {
                params: { bookId: selectedBookForRename.id, name: newBookName }
            });
            if (response.status === 200) {
                console.log("Книга успешно переименована");
                const updatedBooks = books.map(book =>
                    book.id === selectedBookForRename.id ? { ...book, name: newBookName } : book
                );
                setBooks(updatedBooks);
                //setSelectedBook({ ...selectedBook, name: newBookName });
                setSelectedBookForRename({});
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("Ошибка при переименовании книги:", error);
            alert("Ошибка при переименовании книги. Проверьте консоль для деталей.");
        }
    };

    const handleStart = () => {
        const contactsMotionDiv = document.getElementById('bookPanelId');
        if (contactsMotionDiv) {
            contactsMotionDiv.scrollIntoView({ behavior: 'smooth',
                block: 'center' });
        }
    }

    return (
        <>
            {loading ? (
                <svg className="spinner" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
            ) : (
                <div>
                    <AddressBooksHeaderComponent handleStart={handleStart} />
                    <div className="flex h-fit mt-5" id={"bookPanelId"}>
                        <div className="w-1/5 overflow-y-auto border-r border-gray-200 mt-5">
                            <div className="p-2 flex mx-auto justify-center items-center space-x-2">
                                <button onClick={addBook} className="contacts-add-book-but text-white inter-font px-4 py-2 rounded">
                                    Добавить
                                </button>
                            </div>
                            <div className="addressBooksContainer">
                                <ol className="addressBooksList">
                                    {books.map((book, index) => (
                                        <li key={book.id + "_book"} className={`addressBookItem ${book.id === selectedBook.id ? 'selected' : ''}`}>
                                            <div className="bookDetails">
                                                <div onClick={() => toggleGroup(index)} className="bookName">
                                                    {book.id === selectedBook.id ? <BookOpen className="icon" size={22} /> : <Book className="icon" size={22} />}
                                                    <span className="name">{book.name}</span>
                                                </div>
                                                {book.id !== 0 ? (
                                                    <div className="actions">
                                                        <FaEdit className="edit" onClick={() => renameBook(book.id)} />
                                                        <FaTrash className="delete" onClick={() => deleteBook(book.id)} />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        <ContactsConsoleComponent selectedBook={selectedBook.id} books={books} bookName={selectedBook.name}
                                                  acceptSelection={acceptSelection} toggleContactSelection={toggleContactSelection} clearSelection={clearSelection} selectedContacts={selectedContacts} />
                    </div>
                    <SelectedContactsComponent selectedContacts={selectedContacts} />
                </div>
            )}

            {showUpload && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg inter-font">
                        <input type="file"
                               onChange={handleFileChange}
                               style={{ display: 'block', marginBottom: '2vh', width: '100%' }}
                               className={"mx-auto"}
                        />
                        <button className="btn btn-primary bg-dark"
                                onClick={handleFileUpload}
                                style={{ width: '100%' }}
                        >
                            Загрузить
                        </button>
                        <button className="btn btn-secondary mt-2"
                                onClick={() => setShowUpload(false)}
                                style={{ width: '100%' }}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {showRename && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <input type="text"
                               value={newBookName}
                               onChange={handleRenameChange}
                               placeholder="Введите новое название"
                               style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                        />
                        <button className="btn btn-primary bg-dark"
                                onClick={handleRenameSubmit}
                                style={{ width: '100%' }}
                        >
                            Сохранить
                        </button>
                        <button className="btn btn-secondary mt-2"
                                onClick={() => setShowRename(false)}
                                style={{ width: '100%' }}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ContactsMgtPage;
