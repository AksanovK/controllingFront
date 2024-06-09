import React from "react";
import {motion, useAnimation, useScroll} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { format, parseISO } from 'date-fns';
import maleIcon from "../assets/images/male.svg";
import femaleIcon from "../assets/images/female.svg";
import telegramIcon from "../assets/images/tgSmallIcon.svg";
import vkIcon from "../assets/images/vkSmallIcon.svg";
import wsIcon from "../assets/images/wsSmallIcon.svg";
import mailIcon from "../assets/images/mailSmallIcon.svg";


const ContactBodyComponent = ({ gender, birthday, additionalInfo, contactInfo }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const { scrollYProgress } = useScroll();
    const formattedDate = format(parseISO(birthday), 'dd.MM.yyyy');
    const convertImage = (value) => {
        switch (value) {
            case "EMAIL":
                return mailIcon;
                break;
            case "VK":
                return vkIcon;
                break;
            case "WHATSAPP":
                return wsIcon;
                break;
            case "TELEGRAM":
                return telegramIcon;
                break;
            default:
                return mailIcon;
                break;
        }
    }

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

    return (
        <motion.div
            id={"contactBodyDiv"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: '80%', margin: '2vh auto', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px' }}
        >
            <div className="contactDetails">
                <h3>Краткая информация</h3>
                <p>Пол: {gender === 'MALE' ? 'Мужской' : 'Женский'}</p>
                <p>Дата рождения: {formattedDate}</p>
                <p>Дополнительная информация: {additionalInfo}</p>
            </div>
            <div className="contactAddress">
                <h3>Контактная информация</h3>
                <ul>
                    {contactInfo.map((info, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '2vh', marginTop: '5vh' }}>
                            <img src={convertImage(info.type)} alt={info.type} style={{ width: '16vh', height: '16vh', marginRight: '10px' }} />
                            <span>{info.value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

export default ContactBodyComponent;
