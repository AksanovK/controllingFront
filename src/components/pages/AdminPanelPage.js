import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsComponent from "../SettingsComponent";
import CreateUserComponent from "../CreateUserComponent";
import axios from "axios";

const AdminPanelPage = () => {
    const [activeComponent, setActiveComponent] = useState(0);

    const saveSettings = async (settings) => {
        try {
            const response = await axios.post('api/settings/saveSettings', settings, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Settings saved:', response.data);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const components = [
        <SettingsComponent saveSettings={saveSettings} />,
        <CreateUserComponent />
    ];

    const handleSwipe = (direction) => {
        if (direction === 'right' && activeComponent > 0) {
            setActiveComponent(activeComponent - 1);
        } else if (direction === 'left' && activeComponent < components.length - 1) {
            setActiveComponent(activeComponent + 1);
        }
    };

    return (
        <div className="relative h-screen flex flex-col items-center justify-center">
            <div
                className="absolute h-screen left-0 top-0 bottom-0 w-1/5 cursor-pointer hover:bg-gradient-to-r hover:from-gray-300 hover:to-transparent"
                onClick={() => handleSwipe('right')}
            ></div>
            <div
                className="absolute h-screen right-0 top-0 bottom-0 w-1/5 cursor-pointer hover:bg-gradient-to-l hover:from-gray-300 hover:to-transparent"
                onClick={() => handleSwipe('left')}
            ></div>

            <div className="flex mt-16 justify-center mb-4">
                <div className="flex space-x-2">
                    {components.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === activeComponent ? 'bg-black' : 'bg-gray-400'}`}
                        ></div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeComponent}
                    initial={{ x: activeComponent === 0 ? -100 : 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: activeComponent === 0 ? 100 : -100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full flex items-center justify-center"
                >
                    {components[activeComponent]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AdminPanelPage;
