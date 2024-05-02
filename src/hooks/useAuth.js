import { useState } from 'react';
import axios from 'axios';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (email, password) => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            const response = await axios.post('/api/logout', {}, { withCredentials: true });
            if (response.status === 200) {
                setIsAuthenticated(false);
            } else {
                alert('Не удалось выйти из системы');
            }
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
        }
    };

    return {
        isAuthenticated,
        login,
        logout,
    };
}
