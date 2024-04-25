import React, {useEffect, useState} from 'react';
import redDot from "../../assets/images/reddot.svg";
import greenDot from "../../assets/images/greendot.svg";
import UploadIcon from "../../assets/images/uploadIcon.svg";
import {useInView} from "react-intersection-observer";
import {motion, useAnimation} from "framer-motion";
import axios from "axios";
import {useSelector} from "react-redux";
import AddressBooksHeaderComponent from "../AddressBooksHeaderComponent";
import TableComponent from "../tables/TableComponent";
const AddressBook = ({ book, onClick, onDelete }) => {
    return (
        <div className="col-md-3 mb-5" onClick={() => onClick(book.id)}>
            <div className="card h-100 shadow-sm addressBookDiv bg-dark text-white" style={{height: '52vh', width: '32vh', position: 'relative'}}>
                <button onClick={(e) => {
                    e.stopPropagation();
                    onDelete(book.id);
                }}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            border: 'none',
                            background: 'transparent',
                            color: 'white',
                            fontSize: '20px',
                            cursor: 'pointer'
                        }}>
                    &#x2715;
                </button>
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <h5 className="card-title">{book.name}</h5>
                </div>
                <div className="card-body d-flex flex-column justify-content-end align-items-end">
                    <button className="addressBookOpenButton" style={{height: '5vh', width: '20vh'}}>
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
};


function AddressBooksPage() {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [currentPage, setCurrentPage] = useState(1);
    const [addressBooks, setAddressBooks] = useState([]);
    const itemsPerPage = 8;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [loading, setLoading] = useState(true);
    const userId = useSelector(state => state.user.user);
    const [file, setFile] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showContacts, setShowContacts] = useState(false);
    const currentItems = addressBooks.slice(indexOfFirstItem, indexOfLastItem);
    const [showUpload, setShowUpload] = useState(false);

    const addressBooksTest = [
        { id: 1, name: 'Address Book 1', description: 'Description 1' },
        { id: 2, name: 'Address Book 2', description: 'Description 2' },
        { id: 3, name: 'Address Book 3', description: 'Description 3' },
        { id: 4, name: 'Address Book 4', description: 'Description 1' },
        { id: 5, name: 'Address Book 5', description: 'Description 2' },
        { id: 6, name: 'Address Book 6', description: 'Description 3' },
        { id: 7, name: 'Address Book 7', description: 'Description 1' },
        { id: 8, name: 'Address Book 8', description: 'Description 2' },
        { id: 9, name: 'Address Book 9', description: 'Description 3' },
        { id: 10, name: 'Address Book 10', description: 'Description 1' },
        { id: 11, name: 'Address Book 11', description: 'Description 2' },
        { id: 12, name: 'Address Book 12', description: 'Description 3' },
        { id: 13, name: 'Address Book 13', description: 'Description 1' },
        { id: 14, name: 'Address Book 14', description: 'Description 2' },
        { id: 15, name: 'Address Book 15', description: 'Description 3' },
        { id: 16, name: 'Address Book 16', description: 'Description 1' },
        { id: 17, name: 'Address Book 17', description: 'Description 2' },
        { id: 18, name: 'Address Book 18', description: 'Description 3' },
        { id: 19, name: 'Address Book 19', description: 'Description 1' },
        { id: 20, name: 'Address Book 20', description: 'Description 2' },
        { id: 21, name: 'Address Book 21', description: 'Description 3' },
        { id: 22, name: 'Address Book 22', description: 'Description 1' },
        { id: 23, name: 'Address Book 23', description: 'Description 2' },
        { id: 24, name: 'Address Book 24', description: 'Description 3' },
    ];

    useEffect(() => {
        (async function () {
            if (loading === true) {
                let instructionsData = await axios.get('/instructions/get', {
                    params: {
                        userId: userId
                    }
                });
                if (instructionsData) {
                    setAddressBooks(instructionsData.data.books);
                    //setAddressBooks(addressBooksTest)
                    setLoading(false);
                }
            }
        })();
    }, []);

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    React.useEffect(() => {
        const contactsMotionDiv = document.getElementById('contactsMotionDiv');
        if (contactsMotionDiv) {
            contactsMotionDiv.scrollIntoView({ behavior: 'smooth',
                block: 'center' });
        }
    }, [showContacts]);

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const pageCount = Math.ceil(addressBooks.length / itemsPerPage);

    const handleBookClick = async (bookId) => {
        setSelectedBook(bookId);
        try {
            const response = await axios.get(`/addressBooks/getContactsByBookId`, {params: {bookId: bookId}});
            setContacts(response.data);
            setShowContacts(true);
            const contactsMotionDiv = document.getElementById('contactsMotionDiv');
            if (contactsMotionDiv) {
                contactsMotionDiv.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Ошибка при получении контактов:', error);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        let leftSide = currentPage - 1;
        let rightSide = currentPage + 1;

        if (currentPage > 1) {
            pages.push(
                <button key="firstPage" onClick={() => paginate(1)}>
                    &laquo;
                </button>
            );
        }

        for (let i = leftSide; i <= rightSide; i++) {
            if (i > 0 && i <= pageCount) {
                pages.push(
                    <button key={i} onClick={() => paginate(i)} className={currentPage === i ? "active" : ""}>
                        {i}
                    </button>
                );
            }
        }

        pages.push(
            <button key="lastPage" onClick={() => paginate(pageCount)}>
                &raquo;
            </button>
        );

        return pages;
    };

    const handleStart = () => {
        const contactsMotionDiv = document.getElementById('booksRowId');
        if (contactsMotionDiv) {
            contactsMotionDiv.scrollIntoView({ behavior: 'smooth',
                block: 'center' });
        }
    }

    const setStudents = (newStudents) => {
        setContacts(newStudents);
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

        axios.post("/addressBooks/addAddressBook", formData, {
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

    const handleDelete = (contactId) => {
        axios.post("contacts/deleteContact", { contactId: contactId })
            .then(response => {
                const newStudents = contacts.filter(student => student.id !== contactId);
                setStudents(newStudents);
            })
            .catch(error => {
                console.error("There was an error!", error);
            });
    };

    const deleteBook = async (bookId) => {
        try {
            const response = await axios.post("/addressBooks/deleteAddressBook", null, {
                params: {bookId}
            });
            if (response.status === 200) {
                console.log("Книга успешно удалена");
                setAddressBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            }
        } catch (error) {
            console.error("Ошибка при удалении книги:", error);
            alert("Ошибка при удалении книги. Проверьте консоль для деталей.");
        }
    };


    return loading ? (
        <>
            <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </>
    ) : (
        <motion.div
            id={"communicationVariantMotion"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={"animationCreateMailDiv"}
        >
            <AddressBooksHeaderComponent handleStart={handleStart} />
            <div className="container mt-5 booksDiv">
                <div id={"booksRowId"} className="row">
                    {currentItems.map(book => (
                        <AddressBook key={book.id} book={book} onClick={handleBookClick} onDelete={deleteBook} />
                    ))}
                </div>
            </div>
            <div className="pagination paginationBooks">
                {getPageNumbers()}
            </div>
            <div className="uploadContainer"
                 onMouseEnter={() => setShowUpload(true)}
                 onMouseLeave={() => setShowUpload(false)}
                 style={{ maxWidth: '35vh' }}
            >
                {showUpload ? (
                    <>
                        <input type="file"
                               onChange={handleFileChange}
                               style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                        />
                        <button className="btn btn-primary bg-dark"
                                onClick={handleFileUpload}
                                style={{ width: '100%' }}
                        >
                            Загрузить
                        </button>
                    </>
                ) : (
                    <img src={UploadIcon}
                         style={{ marginBottom: '10vh', width: '8vh', height: '8vh', cursor: 'pointer', display: 'block', margin: 'auto' }}
                         alt="Upload Icon"
                    />
                )}
            </div>
            {showContacts && <TableComponent contacts={contacts} setStudents={setStudents} handleDelete={handleDelete}/>}
        </motion.div>
    );
}

export default AddressBooksPage;
