import React, { useState } from 'react';

const SettingsComponent = ({ saveSettings }) => {
    const [settings, setSettings] = useState({
        vkToken: '',
        telegramToken: '',
        gmailUser: '',
        gmailPassword: '',
        maytapiApiUrl: '',
        maytapiToken: '',
        subscribeVk: '',
        subscribeWs: '',
        subscribeTg: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({
            ...settings,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveSettings(settings);
    };

    return (
        <div className="settings-container max-w-4xl mx-auto p-8 bg-white text-gray-900 rounded-lg shadow-lg">
            <h2 className="settings-title text-2xl font-bold mb-6">Settings</h2>
            <form onSubmit={handleSubmit} className="settings-form space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(settings).map((key) => (
                        <div key={key} className="form-group">
                            <label className="form-label block text-sm font-medium mb-2 capitalize">{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={settings[key]}
                                onChange={handleChange}
                                className="form-input w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="submit"
                    className="form-button w-full py-2 bg-black hover:bg-gray-700 rounded-md font-semibold text-white"
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default SettingsComponent;
