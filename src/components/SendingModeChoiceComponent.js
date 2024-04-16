import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React, {useState} from "react";
import cloud from "../assets/cloud.svg";

const SendingModeChoiceComponent = ({handleHoverMode}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [hoveredText, setHoveredText] = useState(null);

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
            id={"SendingModeChoice"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: "104vh", margin: '2vh auto' }}
        >
            <h2 className="instructionTitleNew">Выберите режим отправки</h2>
            <div style={{ position: 'relative', width: '100%' }}>
                {/* Облако с надписями */}
                <div className="cloud-container">
                    <img src={cloud} alt="Cloud" className="cloud-icon" />
                    <motion.div
                        className="mail-text"
                        onHoverStart={() => setHoveredText("service")}
                        onHoverEnd={() => setHoveredText(null)}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleHoverMode("service")}
                    >
                        Почта<br/>пользователя
                    </motion.div>
                    <motion.div
                        className="mail-text"
                        onHoverStart={() => setHoveredText("user")}
                        onHoverEnd={() => setHoveredText(null)}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleHoverMode("user")}
                    >
                        Почта<br/>сервиса
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default SendingModeChoiceComponent;
