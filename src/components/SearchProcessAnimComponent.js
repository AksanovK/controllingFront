import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TableComponent from "./tables/TableComponent";
import axios from "axios";

const SearchProcessAnimComponent = ({ handleSearch }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showTable, setShowTable] = useState(false);
    const [contacts, setContacts] = useState([]);

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
        { id: 1, firstName: 'Иван', lastName: "Иванов",  website: "https://www.google.ru/11111111111111111111111111111111111111", dob: "01.01.1990", gender: "мужчина", tg: true, vk: false, whatsapp: true, mail: true },
        { id: 2, firstName: 'Мария', lastName: 'Петрова', website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: true, whatsapp: false, mail: true },
        { id: 3, firstName: 'Иван', lastName: "Иванов",     website: "https://www.google.ru/", dob: "01.01.1990", gender: "мужчина", tg: true, vk: false, whatsapp: true, mail: true },
        { id: 4, firstName: 'Мария', lastName: 'Петрова', website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: true, whatsapp: false, mail: true },
        { id: 5,  firstName: 'Иван', lastName: "Иванов",  website: "https://www.google.ru/", dob: "01.01.1990", gender: "мужчина", tg: true, vk: false, whatsapp: true, mail: true },
        { id: 6, firstName: 'Иван', lastName: "Иванов", website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: true, whatsapp: false, mail: true },
        { id: 7,  firstName: 'Мария', lastName: 'Петрова',  website: "https://www.google.ru/", dob: "01.01.1990", gender: "мужчина", tg: true, vk: false, whatsapp: true, mail: true },
        { id: 8, firstName: 'Мария', lastName: 'Петрова', website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: true, whatsapp: false, mail: true },
        { id: 9, firstName: 'Мария', lastName: 'Петрова',   website: "https://www.google.ru/", dob: "01.01.1990", gender: "мужчина", tg: true, vk: false, whatsapp: true, mail: true },
        { id: 10, firstName: 'Мария', lastName: 'Петрова', website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: true, whatsapp: false, mail: true },
        { id: 11, firstName: 'Иван', lastName: "Иванов",   website: "https://www.google.ru/", dob: "01.01.1990", gender: "мужчина", tg: true, vk: false, whatsapp: true, mail: true },
        { id: 12, firstName: 'Мария', lastName: 'Петрова',website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: true, whatsapp: false, mail: true },
        { id: 13, firstName: 'Иван', lastName: "Иванов",   website: "https://www.google.ru/", dob: "01.01.1990", gender: "мужчина", tg: true, vk: false, whatsapp: true, mail: true },
        { id: 14, firstName: 'Мария', lastName: 'Петрова', website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: true, whatsapp: false, mail: true },
        { id: 15, firstName: 'Иван', lastName: "Иванов",   website: "https://www.google.ru/", dob: "01.01.1990", gender: "мужчина", tg: true, vk: true, whatsapp: true, mail: true },
        { id: 16, firstName: 'Мария', lastName: 'Петрова', website: "https://www.google.ru/", dob: "02.02.1992", gender: "девушка", tg: false, vk: false, whatsapp: false, mail: false },
    ];

    useEffect(() => {
        (function () {
            setContacts(testData5);
        })();
    }, []);

    const setStudents = (newStudents) => {
        setContacts(newStudents)
    };

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    const handleDelete = (contactId) => {
        console.log("Can't delete")
        // axios.post("contacts/deleteContact", { contactId: contactId })
        //     .then(response => {
        //         const newStudents = contacts.filter(student => student.id !== contactId);
        //         setStudents(newStudents);
        //     })
        //     .catch(error => {
        //         console.error("There was an error!", error);
        //     });
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
                <div className="loading-screen">
                    {`${loadingProgress}%`}
                </div>
            )}
            {showTable && <TableComponent contacts={contacts} setStudents={setStudents} handleDelete={handleDelete} />}

        </motion.div>
    );
}

export default SearchProcessAnimComponent;
