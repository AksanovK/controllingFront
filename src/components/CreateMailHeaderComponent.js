import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {MessengersConverter} from "../utils/messengersConverter";

const CreateMailHeaderComponent= ({messenger, bookName, address, isCascade, selectedMessengers}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [messengerText, setMessengerText] = React.useState("");
    const [bookText, setBookText] = React.useState("");

    useEffect(() => {
        if (inView) {
            controls.start('visible');
            if (!isCascade) {
                setMessengerText("Выбранный способ связи: " + messenger);
            } else {
                const messengersList = selectedMessengers.map(m => MessengersConverter(m)).join(', ');
                setMessengerText("Выбранные способы связи: " + messengersList);
            }
            setBookText("Выбранная адресная книга: " + bookName);
        } else {
            controls.start('hidden');
        }
    }, [controls, inView, messenger, bookName, address]);

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    return (
        <motion.div
            id={"communicationVariantMotion"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ height: '100%', textAlign: 'left', width: '100%', margin: '2vh auto' }}
        >
            <h2 className="createMailHeaderFirstText">{messengerText}</h2>
            <h2 className="createMailHeaderText">{bookText}</h2>
        </motion.div>
    );
}

export default CreateMailHeaderComponent;
