import React, {useCallback, useEffect, useState} from 'react';
import styled, { keyframes } from 'styled-components';
import { gsap, CSSPlugin, Expo } from 'gsap';
import SearchTableComponent from "../tables/SearchTableComponent";
import {HiOutlineCheckCircle, HiOutlineDownload} from "react-icons/hi";
import AcceptWindow from "../AcceptWindow";
import exportToExcel from "../../utils/exportToExcel";

gsap.registerPlugin(CSSPlugin);

const simpleFlicker = keyframes`
  50% {
    opacity: 0;
  }
`;

function LoadingPage({setIsLoadingFinished, isLoadingFinished}) {
    const [counter, setCounter] = useState(0);
    const [loadingTitle, setLoadingTitle] = useState('Preparing data...');
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [score, setScore] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const pageCount = Math.ceil(contacts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    let testData5 = [
        { id: 1, name: 'Иван Иванов',       vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №121", gender: "мужчина", info: "Олимпиада по математике - победитель"},
        { id: 2, name: 'Мария Петровна',    vk: "https://vk.com/test",  score: "2.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Лицей №131", gender: "девушка", info: "Олимпиада по математике - призер"},
        { id: 3, name: 'Иван Иванов',       vk: "https://vk.com/test",  score: "1.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №78", gender: "мужчина", info: "Олимпиада по информатике - победитель" },
        { id: 4, name: 'Мария Петровна',    vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №141", gender: "девушка", info: "Олимпиада по физике - призер"},
        { id: 5,  name:  'Иван Иванов',     vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №121", gender: "мужчина", info: "Олимпиада по математике - призер"},
        { id: 6, name: 'Иван Иванов',       vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №121", gender: "девушка", info: "Исследования"},
        { id: 7,  name:  'Мария Петровна',  vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Лицей №131", gender: "мужчина", info: "Конференция"},
        { id: 8, name: 'Мария Петровна',    vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №54", gender: "девушка", info: "Олимпиада по информатике - победитель"},
        { id: 9, name: 'Мария Петровна',    vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №52", gender: "мужчина",  info: "-"},
        { id: 10, name:  'Мария Петровна',  vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №78", gender: "девушка", info: "Исследования" },
        { id: 11, name:  'Иван Иванов',     vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №78", gender: "мужчина", info: "Исследования"},
        { id: 12, name:  'Мария Петровна',  vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Лицей №18", gender: "девушка", info: "-"},
        { id: 13, name:  'Иван Иванов',     vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №141", gender: "мужчина", info: "Конференция"},
        { id: 14, name:  'Мария Петровна',  vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №141", gender: "девушка", info: "Конференция"},
        { id: 15, name:  'Иван Иванов',     vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №52", gender: "мужчина", info: "Олимпиада по информатике - победитель"},
        { id: 16, name:  'Мария Петровна',  vk: "https://vk.com/test",  score: "3.0", grade: "11 класс", city: "Москва", subject: "Математика", school: "Школа №52", gender: "девушка", info: "Олимпиада по информатике - призер"},
    ];

    useEffect(() => {
        const count = setInterval(() => {
            setCounter((prevCounter) => {
                if (prevCounter < 100) {
                    const newCounter = prevCounter + 1;
                    updateLoadingTitle(newCounter);
                    return newCounter;
                } else {
                    clearInterval(count);
                    reveal();
                    setTimeout(() => {
                        setIsLoadingFinished(true);
                    }, 4000);
                    setContacts(testData5);
                    return 100;
                }
            });
        }, 150);
    }, []);

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
            onComplete: () => console.log("Animation complete"),
        });
        tl.to(".follow", { width: "100%", ease: Expo.easeInOut, duration: 1.2, delay: 0.7 })
            .to(".hide", { opacity: 0, duration: 0.3 })
            .to(".hide", { display: "none", duration: 0.1 })
            .to(".follow", { height: "100%", ease: Expo.easeInOut, duration: 0.7, delay: 0.5 })
            .to(".content", { top:"50%", left:"50%", height: "70%", width: "70%", ease: Expo.easeInOut, duration: 0.7 })
            .to(".title-lines", { display: "block", duration: 0.1 })
            .to(".title-lines", { opacity: 1, stagger: 0.15, ease: Expo.easeInOut, duration: 0.6 });
    };

    const handleDetails = useCallback((student) => {
        setTitle(student.city + " - " + student.school);
        setBody(student.grade + " - " + student.subject);
        setScore(student.score);
        setOpen(true);
    }, []);

    const downloadExcel = () => {
        exportToExcel(testData5, "test");
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
            <Loading classname={"rounded-2xl"}>
                <Follow className="follow"></Follow>
                <ProgressBar id={"loadingDivId1"}  className="hide" style={{ width: `${counter}%` }}></ProgressBar>
                <Count className="hide">{counter}%</Count>
                <LoadingTitle>{loadingTitle}</LoadingTitle>
            </Loading>

            <Content id={"loadingDivId2"} className="content">
                <div className="relative mx-auto w-full h-full">
                    {contacts && <SearchTableComponent contacts={contacts} handleDetails={handleDetails} indexOfLastItem={indexOfLastItem} indexOfFirstItem={indexOfFirstItem}/>}
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
                            className={`relative inter-font text-xl mt-3 mb-4 ${
                                score > 2.0
                                    ? 'text-green-500'
                                    : score >= 1.5
                                        ? 'text-orange-500'
                                        : 'text-red-500'
                            }`}
                        >
                            Приоритет: { } {
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

export default LoadingPage;

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
