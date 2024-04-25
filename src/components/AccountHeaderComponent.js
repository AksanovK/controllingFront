import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React, {useEffect, useRef, useState} from "react";
import vkSmall from "../assets/images/vkSmallIcon.svg";
import wsSmall from "../assets/images/wsSmallIcon.svg";
import mailSmall from "../assets/images/mailSmallIcon.svg";
import tgSmall from "../assets/images/tgSmallIcon.svg";
import {Doughnut} from "react-chartjs-2";


const AccountHeaderComponent = ({ handleImageClick }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();

    const [isActive, setIsActive] = useState({
        facebook: true,
        twitter: false,
        instagram: true
    });

    const iconStyle = (active) => ({
        opacity: active ? 1 : 0.5,
        width: '8vh',
        height: '8vh',
        cursor: 'pointer',
        margin: '0 10px',
        marginRight: '3vh',
        alignItems: 'center'
    });

    React.useEffect(() => {
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

    const booksCount = 10;
    const messagesSent = 10;

    const data = {
        labels: ['Заполнено', 'Незаполнено'],
        datasets: [
            {
                label: 'Заполненность аккаунта',
                data: [70, 30], // Пример данных
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <motion.div
            id={"communicationVariantMotion"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={"animationHeaderDiv"}
        >
            <div className={"accountHeaderDiv"}>
                <div className={"accountMarginDiv"}>
                    <span className="accountBoldP">ФИО:</span>
                    <span className="accountP">Имя и фамилия</span>
                </div>
                <div className={"accountMarginDiv"}>
                    <span className="accountBoldP">Роль:</span>
                    <span className="accountP">admin</span>
                </div>
            </div>
            <div className={"accountHeaderDiv"}>
                <div className={"accountMarginIconsDiv"}>
                    <img src={vkSmall} alt="Vk" style={iconStyle(isActive.facebook)} onClick={() => setIsActive({...isActive, facebook: !isActive.facebook})} />
                    <img src={wsSmall} alt="Ws" style={iconStyle(isActive.twitter)} onClick={() => setIsActive({...isActive, twitter: !isActive.twitter})} />
                    <img src={tgSmall} alt="Tg" style={iconStyle(isActive.instagram)} onClick={() => setIsActive({...isActive, instagram: !isActive.instagram})} />
                    <img src={mailSmall} alt="Mail" style={iconStyle(isActive.instagram)} onClick={() => setIsActive({...isActive, instagram: !isActive.instagram})} />
                </div>
            </div>
            <div className="statisticsDiv">
                <h3 className="statisticsHeader">Статистика</h3>
                {/*<Doughnut data={data} />*/}
                <p>Количество адресных книг: {booksCount}</p>
                <p>Количество отправленных сообщений: {messagesSent}</p>
            </div>
        </motion.div>
    );
}

export default AccountHeaderComponent;
