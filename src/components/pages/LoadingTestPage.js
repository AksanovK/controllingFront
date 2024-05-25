import React, {useCallback, useEffect, useRef, useState} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styled, { keyframes } from 'styled-components';
import { gsap, CSSPlugin, Expo } from 'gsap';
import SearchTableComponent from "../tables/SearchTableComponent";
import { HiOutlineCheckCircle, HiOutlineDownload } from "react-icons/hi";
import AcceptWindow from "../AcceptWindow";
import exportToExcel from "../../utils/exportToExcel";

gsap.registerPlugin(CSSPlugin);

const simpleFlicker = keyframes`
  50% {
    opacity: 0;
  }
`;

function LoadingTestPage({ setIsLoadingFinished, isLoadingFinished, selectedCriteria, selectedSubject }) {
    const [counter, setCounter] = useState(0);
    const [loadingTitle, setLoadingTitle] = useState('Подготовка данных...');
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [score, setScore] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [processStep, setProcessStep] = useState('init');
    const [error, setError] = useState('');
    const [stepCompleted, setStepCompleted] = useState(false); // Новый флаг
    const [stepStartTime, setStepStartTime] = useState(Date.now()); // Время старта этапа
    const itemsPerPage = 4;
    const pageCount = Math.ceil(contacts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const TIMEOUT = 300000;
    const timeoutId = useRef(null);
    const stompClient = useRef(null);
    const currentStep = useRef('init');

    const startTimeout = (step) => {
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
            setError(`Превышено время ожидания на шаге: ${step}`);
        }, TIMEOUT);
    };

    const handleProcessStep = (msgData) => {
        console.log(`Текущий шаг: ${currentStep.current}, статус сообщения: ${msgData.status}`);

        if ((currentStep.current === 'init' || currentStep.current === 'parsing') && msgData.status === 'completed') {
            clearTimeout(timeoutId.current);
            setStepCompleted(true);
            startTimeout('ranking');
            stompClient.current.publish({
                destination: "/app/loading/startRanking",
                body: JSON.stringify({ name: msgData.filename })
            });
            setProcessStep('ranking');
            currentStep.current = 'ranking';
            console.log('Инициализация и парсинг завершены, переход к ранжированию');
        } else if (currentStep.current === 'ranking' && msgData.status === 'completed') {
            clearTimeout(timeoutId.current);
            setStepCompleted(true);
            startTimeout('searching');
            stompClient.current.publish({
                destination: "/app/loading/startSearching",
                body: JSON.stringify({ name: msgData.filename })
            });
            setProcessStep('searching');
            currentStep.current = 'searching';
            console.log('Ранжирование завершено, переход к поиску');
        } else if (currentStep.current === 'searching' && msgData.status === 'Completed') {
            clearTimeout(timeoutId.current);
            setContacts(msgData.result);
            console.log("Итоговые результаты: ", msgData.result);
            setCounter(100);
            setTimeout(() => {
                setIsLoadingFinished(true);
            }, 4000);
            reveal();
            stompClient.current.deactivate();
            console.log("Процесс завершен, соединение закрыто");
        } else if (msgData.status === 'error') {
            setError(`Ошибка: ${msgData.message}`);
            console.log(`Ошибка получена: ${msgData.message}`);
        }
    };

    useEffect(() => {
        const socket = new SockJS('http://79.174.91.77:8005/api/ws');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
        });

        stompClient.current.onConnect = () => {
            stompClient.current.subscribe('/topic/searching', (message) => {
                const msgData = JSON.parse(message.body);
                console.log("Получено сообщение: ", msgData);
                handleProcessStep(msgData);
            });

            if (currentStep.current === 'init') {
                startTimeout('init');
                stompClient.current.publish({
                    destination: "/app/loading/startParsing",
                    body: JSON.stringify({ subject: selectedSubject, type: selectedCriteria })
                });
                console.log('Сообщение отправлено: ' + JSON.stringify({ subject: selectedSubject, type: selectedCriteria }));
            }
        };

        stompClient.current.activate();

        return () => {
            if (stompClient.current.connected) {
                clearTimeout(timeoutId.current);
                stompClient.current.deactivate();
                console.log("Соединение закрыто");
            }
        };
    }, [selectedCriteria, selectedSubject]);

    useEffect(() => {
        console.log(`Состояние processStep изменилось: ${processStep}`);
        currentStep.current = processStep;
    }, [processStep]);

    useEffect(() => {
        const count = setInterval(() => {
            setCounter((prevCounter) => {
                let newCounter = prevCounter;

                // Обновление счетчика в зависимости от текущего этапа и времени
                if (!stepCompleted) {
                    if (processStep === 'init' && prevCounter < 40) {
                        newCounter = prevCounter + 1;
                    } else if (processStep === 'parsing' && prevCounter < 70) {
                        newCounter = prevCounter + 1;
                    } else if (processStep === 'ranking' && prevCounter < 99) {
                        newCounter = prevCounter + 1;
                    }
                } else {
                    if (processStep === 'ranking') {
                        newCounter = 70;
                    } else if (processStep === 'searching') {
                        newCounter = 99;
                    }
                }

                updateLoadingTitle(newCounter);
                return newCounter;
            });

            if (stepCompleted) {
                setStepCompleted(false);
                setStepStartTime(Date.now());
            }
        }, 150);

        return () => clearInterval(count);
    }, [processStep, stepCompleted]);

    const updateLoadingTitle = (newCounter) => {
        if (newCounter <= 40) {
            setLoadingTitle('Поиск новых данных');
        } else if (newCounter <= 70) {
            setLoadingTitle('Обработка и ранжирование');
        } else if (newCounter <= 100) {
            setLoadingTitle('Поиск средств связи');
        }
    };

    const reveal = () => {
        const tl = gsap.timeline({
            onComplete: () => console.log("Анимация завершена"),
        });
        tl.to(".follow", { width: "100%", ease: Expo.easeInOut, duration: 1.2, delay: 0.7 })
            .to(".hide", { opacity: 0, duration: 0.3 })
            .to(".hide", { display: "none", duration: 0.1 })
            .to(".follow", { height: "100%", ease: Expo.easeInOut, duration: 0.7, delay: 0.5 })
            .to(".content", { top: "50%", left: "50%", height: "70%", width: "70%", ease: Expo.easeInOut, duration: 0.7 })
            .to(".title-lines", { display: "block", duration: 0.1 })
            .to(".title-lines", { opacity: 1, stagger: 0.15, ease: Expo.easeInOut, duration: 0.6 });
    };

    const handleDetails = useCallback((student) => {
        setTitle(student.city + " - " + student.school);
        setBody(student.grade + " - " + student.subject);
        setScore(student.score);
        setOpen(true);
    }, []);

    const getColorClass = (score) => {
        if (score > 2.0) return 'text-green-500';
        if (score >= 1.5) return 'text-orange-500';
        return 'text-red-500';
    };

    const downloadExcel = () => {
        exportToExcel(contacts, "test");
    }

    const handleDownload = () => {
        setIsDownloading(true);
        downloadExcel();
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPageNumbers = () => {
        const pages = [];
        let leftSide = currentPage - 1;
        let rightSide = currentPage + 1;

        if (currentPage > 1) {
            pages.push(
                <button key="firstPage" onClick={() => paginate(1)}>
                    &laquo;
                </button>
            );
        }

        for (let i = leftSide; i <= rightSide; i++) {
            if (i > 0 && i <= pageCount) {
                pages.push(
                    <button key={i} onClick={() => paginate(i)} className={currentPage === i ? "active" : ""}>
                        {i}
                    </button>
                );
            }
        }

        if (contacts.length !== 0) {
            pages.push(
                <button key="lastPage" onClick={() => paginate(pageCount)}>
                    &raquo;
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="mt-auto h-screen w-screen justify-center items-center text-center">
            {error && <div className="text-red-500">{error}</div>}
            <Loading className={"rounded-2xl"}>
                <Follow className="follow"></Follow>
                <ProgressBar id={"loadingDivId1"} style={{ width: `${counter}%` }}></ProgressBar>
                <Count>{counter}%</Count>
                <LoadingTitle>{loadingTitle}</LoadingTitle>
            </Loading>

            <Content id={"loadingDivId2"} className="content">
                <div className="relative mx-auto w-full h-full">
                    {contacts && <SearchTableComponent contacts={contacts} handleDetails={handleDetails} indexOfLastItem={indexOfLastItem} indexOfFirstItem={indexOfFirstItem} />}
                </div>
            </Content>
            {isLoadingFinished && (
                <div className="z-50 absolute downloadingIcon flex justify-center items-center">
                    {isDownloading ? (
                        <HiOutlineCheckCircle size={42} className="mr-16 text-green-500" />
                    ) : (
                        <HiOutlineDownload size={42} onClick={() => handleDownload()} className="mr-16 text-black cursor-pointer" />
                    )}
                </div>
            )}
            {isLoadingFinished && (
                <div className="search-pagination justify-center">
                    {getPageNumbers()}
                </div>
            )}
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
                        <p
                            className={`relative inter-font text-xl mt-3 mb-4 ${getColorClass(parseFloat(score))}`}
                        >
                            Приоритет: {
                            score > 2.0
                                ? 'A+'
                                : score >= 1.5
                                    ? 'B+'
                                    : 'B'
                        }
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
        </div>
    );
}

export default LoadingTestPage;

const Loading = styled.div`
  height: 70%;
  width: 70%;
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 5px solid #222;
  border-radius: 20px;
  margin: 220vh auto 30vh;
`;

const Follow = styled.div`
  position: absolute;
  background-color: black;
  height: 3px;
  width: 0;
  left: 0;
  z-index: 2;
  border-radius: 20px; /* Закругление углов рамки */
`;

const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  background-color: #fff;
  height: 3px;
  width: 0;
  transition: 0.4s ease-out;
`;

const Count = styled.p`
  position: absolute;
  font-size: 130px;
  color: #fff;
  transform: translateY(-15px);
  font-weight: 500;
`;

const Content = styled.div`
  height: 70%;
  width: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: #121212;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  color: #fff;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  margin: 220vh auto 30vh;
  p {
    text-align: center;
    font-size: 30px;
    opacity: 0;
    display: none;
    font-weight: 500;
    margin: 0;
  }
`;

const LoadingTitle = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 24px;
  color: #ffffff;
  font-weight: 500;
  animation: ${simpleFlicker} 2s infinite;
`;
