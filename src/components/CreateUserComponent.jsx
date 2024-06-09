import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FaEdit} from "react-icons/fa";

const UserManagementComponent = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({
        id: null,
        email: '',
        password: '',
        role: 'USER',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await axios.get('/api/settings/getUsers');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user.email || !user.password || !user.firstName || !user.lastName) {
            setError('All fields are required.');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }

        try {
            if (user.id) {
                await axios.post('/api/settings/updateUser', user);
            } else {
                await axios.post('/api/settings/createUser', user);
            }
            setUser({
                id: null,
                email: '',
                password: '',
                role: 'USER',
                firstName: '',
                lastName: ''
            });
            loadUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const editUser = (user) => {
        setUser(user);
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg inter-font">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center inter-font-bold">User Management</h2>

            {showError && (
                <div className="mb-4 p-4 text-white bg-red-600 rounded">
                    {error}
                </div>
            )}

            <div className="flex space-x-16 w-auto">
                <form onSubmit={handleSubmit} className="space-y-4 w-1/2">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                        <select
                            name="role"
                            value={user.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-md font-semibold text-white"
                    >
                        {user.id ? 'Update User' : 'Create User'}
                    </button>
                </form>

                <div className="createUserList p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Users List</h3>
                    <div className="max-h-96 w-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-4">
                        <ul className="space-y-4">
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex justify-between items-center p-4 bg-white shadow-md rounded-md border-l-4 border-gray-300 hover:border-gray-700 transition duration-300 ease-in-out"
                                >
                                    <div className="text-gray-700">{user.firstName} {user.lastName} ({user.email})</div>
                                    <FaEdit
                                        className="cursor-pointer editUser ease-in-out"
                                        onClick={() => editUser(user)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementComponent;
