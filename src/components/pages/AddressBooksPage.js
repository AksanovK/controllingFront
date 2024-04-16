import React from 'react';

const AddressBook = ({ book, onClick }) => {
    return (
        <div onClick={() => onClick(book.id)}>
            <h3>{book.name}</h3>
            <p>{book.description}</p>
        </div>
    );
};


function AddressBooksPage() {
    const addressBooks = [
        { id: 1, name: 'Address Book 1', description: 'Description 1' },
        { id: 2, name: 'Address Book 2', description: 'Description 2' },
        { id: 3, name: 'Address Book 3', description: 'Description 3' },
    ];

    const handleBookClick = (bookId) => {
        console.log('Selected book:', bookId);
    };

    return (
        <div>
            <h1>Address Books</h1>
            {addressBooks.map(book => (
                <AddressBook key={book.id} book={book} onClick={handleBookClick} />
            ))}
        </div>
    );
}

export default AddressBooksPage;
