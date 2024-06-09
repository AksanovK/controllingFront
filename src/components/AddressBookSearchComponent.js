import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React, {useState} from "react";

const AddressBookSearchComponent = ({ addressBooks, handleSetBook }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedBook, setSelectedBook] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const handleSelectBook = (bookId) => {
        const selectedBook = addressBooks.find(book => book.id === bookId);

        if (selectedBook) {
            setSelectedBook(selectedBook.name);
            handleSetBook({name: selectedBook.name, id: selectedBook.id});
        } else {
            setSelectedBook('');
            handleSetBook({name: selectedBook.name, id: selectedBook.id});
        }

        setShowDropdown(false);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setShowDropdown(value !== '');
        if (value === '') {
            setSelectedBook('');
            handleSetBook('');
        }
    };

    const filteredBooks = searchTerm ? addressBooks.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    return (
        <motion.div
            id={"addressBooksSearchMotion"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: "104vh", margin: '2vh auto' }}
        >
            <h2 className="instructionTitleNew">Выберите адресную книгу</h2>
            <div style={{ position: 'relative', width: '100%' }}>
                <input
                    type="search"
                    className="form-control search-input"
                    placeholder="Поиск адресной книги"
                    onChange={handleSearchChange}
                    style={{ paddingRight: '25vh' }}
                />
                <span className="search-icon"></span>
            </div>
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
            <h2 className="instructionAddressBookTitleNew">{selectedBook}</h2>
        </motion.div>
    );
}

export default AddressBookSearchComponent;
