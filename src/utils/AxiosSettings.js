import axios from "axios";
import {manualLogout} from "../state/userSlice";

export function AxiosInit() {
    axios.interceptors.request.use(
        config => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (accessToken) {
                config.headers['ACCESS-TOKEN'] = accessToken;
            }
            if (refreshToken) {
                config.headers['REFRESH-TOKEN'] = refreshToken;
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
    // axios.interceptors.response.use(response => {
    //     return response;
    //     }, async error => {
    //         if (error.response) {
    //             switch (error.response.status) {
    //                 case 401:
    //                     await axios.get('/logout', { withCredentials: true });
    //                     localStorage.clear();
    //                     break;
    //                 case 403:
    //                     localStorage.clear();
    //                     break;
    //             }
    //         }
    // });
    axios.interceptors.response.use(response => {
        return response;}, async error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    if (error.response.data === 'Refresh') {
                        try {
                            const refreshResponse = await axios.get('/refresh', { withCredentials: true });
                            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                            error.config.headers['ACCESS-TOKEN'] = refreshResponse.data.accessToken;
                            return axios(error.config);
                        } catch (refreshError) {
                            manualLogout();
                            const refreshToken = localStorage.getItem('refreshToken');
                            localStorage.clear();
                            await axios.get('/logout', {
                                headers: {
                                    'Refresh-Token': refreshToken
                                }
                            });
                            return Promise.reject(refreshError);
                        }
                    } else {
                        manualLogout();
                        const refreshToken = localStorage.getItem('refreshToken');
                        localStorage.clear();
                        await axios.get('/logout', {
                            headers: {
                                'Refresh-Token': refreshToken
                            }
                        });
                    }
                    break;
                case 403:
                    manualLogout();
                    const refreshToken = localStorage.getItem('refreshToken');
                    localStorage.clear();
                    await axios.get('/logout', {
                        headers: {
                            'Refresh-Token': refreshToken
                        }
                    });
                    break;
                default:
                    break;
            }
        } else {
            console.error('Error response:', error);
        }
        return Promise.reject(error);
    });
}
