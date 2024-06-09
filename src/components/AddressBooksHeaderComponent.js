import { motion, useAnimation } from 'framer-motion';
import {useInView} from "react-intersection-observer";
import React from "react";
import LupaIcon from "../assets/images/lupasearch.svg";

const AddressBooksHeaderComponent = ({handleStart}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();

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

    return (<motion.div
        id={"booksHeaderId"}
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={variants}
        className={"addressBooksHeaderDiv"}
    >
        <h2 className="bookHeaderTitle">Адресные книги</h2>
        <h5 className="bookHeaderSecondTitle">Здесь вы можете ознакомиться со списком существующих адресных книг,<br/>
            а также просмотреть контакты в каждой из них</h5>
        <button onClick={handleStart} className="booksStartButton" aria-label="Продолжить">
            Продолжить
        </button>
    </motion.div>);
}

export default AddressBooksHeaderComponent;
