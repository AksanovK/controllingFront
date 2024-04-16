import React from 'react';

function SearchPage() {
    const handleSearch = () => {
        // Здесь можно добавить логику для запуска поиска абитуриентов
        console.log('Search started');
    };

    return (
        <div>
            <h1>Search Page</h1>
            <p>Нажмите кнопку ниже, чтобы запустить поиск абитуриентов.</p>
            <button onClick={handleSearch}>Запустить</button>
        </div>
    );
}

export default SearchPage;
