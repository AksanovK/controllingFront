import React, {useCallback, useEffect, useState} from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AcceptWindow from "./AcceptWindow";
import {HiOutlineCheckCircle, HiOutlineDownload} from 'react-icons/hi';
import SearchTableComponent from "./tables/SearchTableComponent";
import exportToExcel from "../utils/exportToExcel";

const SearchProcessAnimComponent = ({ handleSearch }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showTable, setShowTable] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (inView) {
            controls.start('visible');
            let progressInterval = setInterval(() => {
                setLoadingProgress(oldProgress => {
                    const newProgress = oldProgress + 3;
                    if (newProgress >= 100) {
                        clearInterval(progressInterval);
                        setShowTable(true);
                        return 100;
                    }
                    return newProgress;
                });
            }, 100);
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    let testData5 = [
        { id: 1, firstName: 'Иван', lastName: "Иванов",     website: "https://vk.com/test", school: "Школа №121", gender: "мужчина", info: "Олимпиада по математике - победитель"},
        { id: 2, firstName: 'Мария', lastName: 'Петрова',   website: "https://vk.com/test", school: "Лицей №131", gender: "девушка", info: "Олимпиада по математике - призер"},
        { id: 3, firstName: 'Иван', lastName: "Иванов",     website: "https://vk.com/test", school: "Школа №78", gender: "мужчина", info: "Олимпиада по информатике - победитель" },
        { id: 4, firstName: 'Мария', lastName: 'Петрова',   website: "https://vk.com/test", school: "Школа №141", gender: "девушка", info: "Олимпиада по физике - призер"},
        { id: 5,  firstName: 'Иван', lastName: "Иванов",    website: "https://vk.com/test", school: "Школа №121", gender: "мужчина", info: "Олимпиада по математике - призер"},
        { id: 6, firstName: 'Иван', lastName: "Иванов",     website: "https://vk.com/test", school: "Школа №121", gender: "девушка", info: "Исследования"},
        { id: 7,  firstName: 'Мария', lastName: 'Петрова',  website: "https://vk.com/test", school: "Лицей №131", gender: "мужчина", info: "Конференция"},
        { id: 8, firstName: 'Мария', lastName: 'Петрова',   website: "https://vk.com/test", school: "Школа №54", gender: "девушка", info: "Олимпиада по информатике - победитель"},
        { id: 9, firstName: 'Мария', lastName: 'Петрова',   website: "https://vk.com/test", school: "Школа №52", gender: "мужчина",  info: "-"},
        { id: 10, firstName: 'Мария', lastName: 'Петрова',  website: "https://vk.com/test", school: "Школа №78", gender: "девушка", info: "Исследования" },
        { id: 11, firstName: 'Иван', lastName: "Иванов",    website: "https://vk.com/test", school: "Школа №78", gender: "мужчина", info: "Исследования"},
        { id: 12, firstName: 'Мария', lastName: 'Петрова',  website: "https://vk.com/test", school: "Лицей №18", gender: "девушка", info: "-"},
        { id: 13, firstName: 'Иван', lastName: "Иванов",    website: "https://vk.com/test", school: "Школа №141", gender: "мужчина", info: "Конференция"},
        { id: 14, firstName: 'Мария', lastName: 'Петрова',  website: "https://vk.com/test", school: "Школа №141", gender: "девушка", info: "Конференция"},
        { id: 15, firstName: 'Иван', lastName: "Иванов",    website: "https://vk.com/test", school: "Школа №52", gender: "мужчина", info: "Олимпиада по информатике - победитель"},
        { id: 16, firstName: 'Мария', lastName: 'Петрова',  website: "https://vk.com/test", school: "Школа №52", gender: "девушка", info: "Олимпиада по информатике - призер"},
    ];

    useEffect(() => {
        (function () {
            setContacts(testData5);
        })();
    }, []);

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    const handleDetails = useCallback((student) => {
        setTitle(student.school);
        setBody(student.info);
        setOpen(true);
    }, []);

    const downloadExcel = () => {
        exportToExcel(testData5, "test");
    }

    const handleDownload = () => {
        setIsDownloading(true);
        downloadExcel();
    };

    return (
        <motion.div
            id={"searchProcessDiv"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={"animationSearchDiv"}
        >
            {!showTable && (
                <div id={"searchTableId"}  className="loading-screen">
                    {`${loadingProgress}%`}
                </div>
            )}
            <div className="relative">
                {showTable && <SearchTableComponent contacts={contacts} handleDetails={handleDetails} />}
                {showTable && (
                    <div className="absolute top-0 right-0 mt-8 mr-8 flex justify-center items-center">
                        {isDownloading ? (
                            <HiOutlineCheckCircle size={42} className="mr-16 text-green-500" />
                        ) : (
                            <HiOutlineDownload size={42} onClick={() => handleDownload()} className="mr-16 cursor-pointer" />
                        )}
                    </div>
                )}
            </div>

            <AcceptWindow open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-auto">
                    <div className="mx-auto">
                        <h3 className="relative text-3xl font-black text-white mt-1 ">Информация</h3>
                        <p className="relative inter-font text-xl text-gray-200 mt-4 mb-4 ">
                            {title}
                        </p>
                        <p className="relative inter-font text-xl text-gray-200 mt-3 mb-4 ">
                            {body}
                        </p>
                    </div>

                    <div className="flex gap-1">
                        <button
                            className="btn inter-font btn-dark w-full hover:bg-gray-200 hover:text-black"
                            onClick={() => setOpen(false)}
                        >
                            Принять
                        </button>
                    </div>
                </div>
            </AcceptWindow>
        </motion.div>
    );
}

export default SearchProcessAnimComponent;
