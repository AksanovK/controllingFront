import React, {useState} from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CreateMailHeaderComponent= ({messenger, bookName, address, scrollMove}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [messengerText, setmessengerText] = useState("");
    const [bookText, setbookText] = useState("");
    const [addressText, setaddressText] = useState("");

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
            printText(1, "Выбранный способ связи: " + messenger);
            printText(2, "Выбранная адресная книга: " + bookName);
            printText(3, "Выбранный адресс: " + (address ? 'адрес пользователя' : 'адрес сервиса'));
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    const printText = (mode, textToPrint) => {
        let index = 0;
        const printInterval = setInterval(() => {
            if (mode === 1) {
                setmessengerText(textToPrint.slice(0, index + 1));
            } else if (mode === 2) {
                setbookText(textToPrint.slice(0, index + 1));
            } else {
                setaddressText(textToPrint.slice(0, index + 1));
            }
            index++;
            if (index === textToPrint.length) {
                clearInterval(printInterval);
            }
        }, 100);
    };

    return (
        <motion.div
            id={"communicationVariantMotion"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ height: '100%', textAlign: 'center', width: '100%', margin: '2vh auto' }}
        >
            <h2 className="createMailHeaderFirstText">{messengerText}</h2>
            <h2 className="createMailHeaderText">{bookText}</h2>
            <h2 className="createMailHeaderText">{addressText}</h2>
        </motion.div>
    );
}

export default CreateMailHeaderComponent;
