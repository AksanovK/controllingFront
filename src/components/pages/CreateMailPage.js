import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';

function CreateMailPage() {
    const location = useLocation();
    const { selectedIcon, selectedBook, isServiceAddress } = location.state;
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Здесь можно добавить логику для отправки письма
        console.log('Sending mail:', {
            selectedIcon,
            selectedBook,
            isServiceAddress,
            subject,
            message
        });
    };

    return (
        <div>
            <h1>Create Mail</h1>
            <p>Selected Communication Type: {selectedIcon}</p>
            <p>Selected Address Book: {selectedBook}</p>
            <p>Is Service Address: {isServiceAddress ? 'Yes' : 'No'}</p>

            {/* Форма для создания письма */}
            <form onSubmit={handleSubmit}>
                {selectedIcon === "mailImage" ? (<label>
                    Subject:
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </label>) : (<></>)}
                <label>
                    Message:
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </label>
                <button type="submit">Send Mail</button>
            </form>
        </div>
    );
}

export default CreateMailPage;
