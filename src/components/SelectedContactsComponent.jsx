import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useState, useEffect } from "react";
import {Check, Trash2} from "react-feather";
import AcceptWindow from "./AcceptWindow";
import CreateMailWindow from "./CreateMailWindow";
import {FaEnvelope, FaSlack, FaTelegramPlane, FaViber} from "react-icons/fa";
import vkSmall from "../assets/images/vkSmallIcon.svg";
import wsSmall from "../assets/images/wsSmallIcon.svg";
import mailSmall from "../assets/images/mailSmallIcon.svg";
import tgSmall from "../assets/images/tgSmallIcon.svg";
import {useSelector} from "react-redux";
import axios from "axios";

export default function SelectedContactsComponent({ selectedContacts }) {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedMessengers, setSelectedMessengers] = useState([]);
    const userId = useSelector(state => state.user.user);

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    const handleChangeAddressBook = () => {
        // Обработка смены адресной книги
    };

    const handleDeleteSelectedContacts = () => {
        const contactsArray = Array.from(selectedContacts);

        const deleteContact = (contactId) => {
            return axios.post("/api/contacts/deleteContact", { contactId })
                .then(response => {
                })
                .catch(error => {
                    console.error("There was an error!", error);
                });
        };

        Promise.all(contactsArray.map(contact => deleteContact(contact.id)))
            .then(() => {
                console.log("All selected contacts have been deleted.");
                window.location.reload();
            })
            .catch(error => {
                console.error("There was an error deleting one or more contacts!", error);
            });
    };

    const fixMessage = (event) => {
        setMessage(event.target.value);
    }

    const handleSendMessage = () => {
        if (Array.from(selectedContacts).length !== 0) {
            setOpen(true);
            deleteErrors("createMailListId");
        } else {
            addErrors("createMailListId");
        }
    };

    const closeModal = () => {
        deleteErrors("createMessageAreaId");
        deleteErrors("createMailMessengersId");
        setOpen(false);
        setMessage('');
        setSelectedMessengers([]);
    };

    const addErrors = (id) => {
        let div = document.getElementById(id);
        if (div) {
            div.classList.add("border-2");
            div.classList.add("border-red-800");
        }
    }

    const deleteErrors = (id) => {
        let div = document.getElementById(id);
        if (div) {
            div.classList.remove("border-2");
            div.classList.remove("border-red-800");
        }
    }

    const toggleMessenger = (messenger) => {
        if (selectedMessengers.includes(messenger)) {
            setSelectedMessengers(selectedMessengers.filter(m => m !== messenger));
        } else {
            setSelectedMessengers([...selectedMessengers, messenger]);
        }
    };

    const acceptMessage = async () => {
        if (selectedMessengers.length === 0) {
            addErrors("createMailMessengersId");
        } else if (message.length === 0) {
            deleteErrors("createMailMessengersId");
            addErrors("createMessageAreaId")
        } else {
            const messageDto = {
                body: message,
                creatorId: userId,
                contactInfo: selectedMessengers.map(messenger => messenger.toUpperCase()),
                contacts: Array.from(selectedContacts).map(contact => contact.id)
            };
            try {
                const response = await axios.post('/api/message/send/contacts', messageDto, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Ошибка при отправке сообщения: ', error.response ? error.response.data : error.message);
            }
            console.log(messageDto);
            closeModal();
        }
    }

    const isSelected = (messenger) => {
        return selectedMessengers.includes(messenger);
    };

    const goToContactPage = (id) => {
        window.open(`/contact?id=${id}`, '_blank');
    };

    return (
        <motion.div
            id={"selectedContactsPanelId"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={"h-auto flex-grow p-4 mt-96 mb-14"}
        >
            <div className="flex-grow console-contacts-root p-4 h-screen rounded-lg">
                <div className="terminal rounded-lg">
                    <div className="terminal-header p-3 flex justify-between items-center rounded-lg">
                        <span>Выбранные контакты</span>
                        <div className={"justify-center align-content-center text-center flex"}>

                        </div>
                    </div>
                    <div id={"createMailListId"} className="terminal-body inter-font-thin rounded-lg">
                        <div style={{ flex: 1, overflow: 'auto' }}>
                            <table className="terminal-table inter-font">
                                <thead className={"text-center"}>
                                <tr>
                                    <th>Имя и фамилия</th>
                                    <th>Адресная книга</th>
                                    <th>Почта</th>
                                    <th>Telegram</th>
                                    <th>VK</th>
                                    <th>WhatsApp</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.from(selectedContacts).map(contact => (
                                    <tr
                                        key={contact.id + "_contact"}
                                        className={`terminal-line cursor-pointer`}
                                        onClick={() => goToContactPage(contact.id)}
                                    >
                                        <td>{contact.firstName} {contact.lastName}</td>
                                        <td>{contact.bookName}</td>
                                        {contact.contactInfo.map((info, index) => (
                                            <td key={index}>
                                                {info.type === 'VK' ? 'https://vk.com/' + info.value : info.value}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="align-self-center rounded-lg p-3 inter-font-bold">
                            <div className={"justify-center align-content-center text-center flex"}>
                                <button onClick={handleChangeAddressBook} className="cursor-not-allowed hover:blur-sm action-button">Поменять адресную книгу</button>
                                <button onClick={handleSendMessage} className="action-button">Написать сообщение</button>
                                <button onClick={handleDeleteSelectedContacts} className="cursor-not-allowed action-button">Удалить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateMailWindow open={open} onClose={() => closeModal()}>
                <div className="text-center w-auto">
                    <div className="mx-auto">
                        <h3 className="relative text-4xl text-white font-black text-white mt-1 ">Сообщение</h3>
                        <div id={"createMailMessengersId"} className="rounded-xl flex justify-center space-x-10 m-5">
                            <img src={vkSmall} alt="Vk" className={`w-16 h-16 text-xl text-white cursor-pointer ${isSelected('VK') ? 'opacity-100' : 'opacity-80'}`}
                                 onClick={() => toggleMessenger('VK')}
                            />
                            <img src={wsSmall} alt="Ws" className={`w-16 h-16 text-xl text-white cursor-pointer ${isSelected('WHATSAPP') ? 'opacity-100' : 'opacity-80'}`}
                                 onClick={() => toggleMessenger('WHATSAPP')}
                            />
                            <img src={tgSmall} alt="Tg" className={`w-16 h-16 text-xl text-white cursor-pointer ${isSelected('TELEGRAM') ? 'opacity-100' : 'opacity-80'}`}
                                 onClick={() => toggleMessenger('TELEGRAM')}
                            />
                            <img src={mailSmall} alt="Mail" className={`w-16 h-16 text-xl text-white cursor-pointer ${isSelected('EMAIL') ? 'opacity-100' : 'opacity-80'}`}
                                 onClick={() => toggleMessenger('EMAIL')}
                            />
                        </div>
                    </div>
                    <div id={"createMessageAreaId"} className="bodyDiv rounded-xl">
                        <textarea
                            placeholder="Body"
                            rows="3"
                            className="min-h-96 textareaField windowTextArea rounded-xl p-2 text-white"
                            value={message}
                            onChange={(e) => fixMessage(e)}
                        />
                    </div>
                    <div className="flex gap-1">
                        <button
                            className="btn inter-font btn-dark w-full hover:bg-gray-200 hover:text-black"
                            onClick={() => acceptMessage()}
                        >
                            Принять
                        </button>
                    </div>
                </div>
            </CreateMailWindow>
        </motion.div>
    );
}
