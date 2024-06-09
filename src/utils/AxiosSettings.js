import axios from "axios";

export function AxiosInit() {
    axios.interceptors.request.use(
        config => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers['ACCESS-TOKEN'] = accessToken;
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
                            const refreshResponse = await axios.get('/api/refresh', {
                                headers: {
                                    'ACCESS-TOKEN': accessToken
                                },
                                withCredentials: true
                            });
                            const newAccessToken = refreshResponse.data[0];
                            localStorage.setItem('accessToken', newAccessToken);
                            error.config.headers['ACCESS-TOKEN'] = newAccessToken;
                            console.log("REFRESH_RESPONSE", refreshResponse.data);
                            return axios(error.config);
                        } catch (refreshError) {
                            console.log("400");
                            localStorage.clear();
                            window.location.href = '/login';
                            return Promise.reject(refreshError);
                        }
                    } else {
                        localStorage.clear();
                        console.log("REFRESH_RESPONSE ELSE");
                        window.location.href = '/login'
                    }
                    break;
                case 403:
                    localStorage.clear();
                    console.log("400");
                    window.location.href = '/login';
                    break;
                case 400:
                    localStorage.clear();
                    console.log("400");
                    window.location.href = '/login';
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
