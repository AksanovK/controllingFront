import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {AxiosInit} from "../utils/AxiosSettings";


export const loginUser = createAsyncThunk('/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth', { email, password }, { withCredentials: true });
        if (response.status === 200) {
            AxiosInit();
            return response.data;
        } else {
            return rejectWithValue('Ошибка авторизации');
        }
    } catch (error) {
        return rejectWithValue('Неправильный логин или пароль');
    }
});

export const logout = createAsyncThunk('/logout', async (_, { rejectWithValue }) => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        localStorage.clear();
        await axios.get('/logout', {
            headers: {
                'Refresh-Token': refreshToken
            }
        });
        return {};
    } catch (error) {
        return rejectWithValue('Ошибка при выходе');
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        accessToken: '',
        refreshToken: '',
        role: '',
        loading: false,
        error: null
    },
    reducers: {
        manualLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = '';
            state.refreshToken = '';
            state.role = '';
            localStorage.clear();
        },
        setCredentials: (state, action) => {
            state.user = action.payload.userId;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.role = action.payload.role;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.userId;
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.role = action.payload.role;
                state.loading = false;
                state.error = null;
                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken);
                localStorage.setItem('user', action.payload.userId);
                localStorage.setItem('role', action.payload.role);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.accessToken = '';
                state.refreshToken = '';
                state.role = '';
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const {manualLogout, setCredentials, clearError } = userSlice.actions;

export default userSlice.reducer;
