import React from 'react';

function ContactPage() {

    const applicantInfo = {
        name: 'Иванов Иван Иванович',
        email: 'ivanov@example.com',
        phone: '+7 (123) 456-78-90',
        address: 'г. Москва, ул. Пушкина, д. 10, кв. 5',
    };

    return (
        <div>
            <h1>Contact Page</h1>
            <h2>Информация о найденном абитуриенте:</h2>
            <p>ФИО: {applicantInfo.name}</p>
            <p>Email: {applicantInfo.email}</p>
            <p>Телефон: {applicantInfo.phone}</p>
            <p>Адрес: {applicantInfo.address}</p>
        </div>
    );
}

export default ContactPage;
