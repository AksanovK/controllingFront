import axios from "axios";
import {manualLogout} from "../state/userSlice";
import {useNavigate} from "react-router-dom";

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
    axios.interceptors.response.use(response => {
        return response;}, async error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    if (error.response.data === 'Refresh') {
                        try {
                            const accessToken = localStorage.getItem('accessToken');
                            const refreshToken = localStorage.getItem('refreshToken');
                            const refreshResponse = await axios.get('/api/refresh', {
                                headers: {
                                    'ACCESS-TOKEN': accessToken,
                                    'REFRESH-TOKEN': refreshToken
                                },
                                withCredentials: true
                            });
                            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                            error.config.headers['ACCESS-TOKEN'] = refreshResponse.data.accessToken;
                            console.log("REFRESH_RESPONSE " + refreshResponse.data);
                            return axios(error.config);
                        } catch (refreshError) {
                            manualLogout();
                            const refreshToken = localStorage.getItem('refreshToken');
                            localStorage.clear();
                            await axios.get('/api/logout', {
                                headers: {
                                    'Refresh-Token': refreshToken
                                }
                            });
                            console.log("REFRESH_RESPONSE_ERROR " + refreshError);
                            return Promise.reject(refreshError);
                        }
                    } else {
                        manualLogout();
                        const refreshToken = localStorage.getItem('refreshToken');
                        localStorage.clear();
                        await axios.get('/api/logout', {
                            headers: {
                                'Refresh-Token': refreshToken
                            }
                        });
                        console.log("REFRESH_RESPONSE ELSE");
                    }
                    break;
                    case 403:
                        manualLogout();
                    const refreshToken = localStorage.getItem('refreshToken');
                    localStorage.clear();
                    await axios.get('/api/logout', {
                        headers: {
                            'Refresh-Token': refreshToken
                        }
                    });
                    console.log("403 ");
                    break;
                    default:
                        break;
            }
        } else {
            console.error('Error response:', error);
        }
        return Promise.reject(error);
    });
    // axios.interceptors.response.use(
    //     response => response,
    //     async error => {
    //         const originalRequest = error.config;
    //         if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
    //             if (error.response.data === 'Refresh') {
    //                 originalRequest._retry = true;
    //                 try {
    //                     const refreshToken = localStorage.getItem('refreshToken');
    //                     const refreshResponse = await axios.get('/refresh', {
    //                         headers: {
    //                             'REFRESH-TOKEN': refreshToken
    //                         },
    //                         withCredentials: true
    //                     });
    //
    //                     if (refreshResponse.data && refreshResponse.data.length === 2) {
    //                         const [newAccessToken, newRefreshToken] = refreshResponse.data;
    //                         localStorage.setItem('accessToken', newAccessToken);
    //                         localStorage.setItem('refreshToken', newRefreshToken);
    //                         originalRequest.headers['ACCESS-TOKEN'] = newAccessToken;
    //                         originalRequest.headers['REFRESH-TOKEN'] = newRefreshToken;
    //                         return axios(originalRequest);
    //                     }
    //                     return axios(originalRequest);
    //                 } catch (refreshError) {
    //                     manualLogout();
    //                     const refreshToken = localStorage.getItem('refreshToken');
    //                     localStorage.clear();
    //                     await axios.get('/logout', {
    //                         headers: {
    //                             'Refresh-Token': refreshToken
    //                         }
    //                     });
    //                     return Promise.reject(refreshError);
    //                 }
    //             }
    //         } else if (error.response && error.response.status === 403) {
    //             const refreshToken = localStorage.getItem('refreshToken');
    //             localStorage.clear();
    //             await axios.get('/logout', {
    //                 headers: {
    //                     'Refresh-Token': refreshToken
    //                 }
    //             });
    //             navigate('/logout');
    //         }
    //         return Promise.reject(error);
    //     }
    // );
}
