import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React from "react";
import LupaIcon from "../assets/images/lupasearch.svg";

const MailerHeaderTitleComponent = ({ handleSearch }) => {
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

    return (
        <motion.div
            id={"mailerHeader"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{textAlign: 'center' }}
        >
            <p className="mailerTitle">Создать новую<br/> рассылку</p>
            <button onClick={handleSearch} className="startButton">
                Начать
            </button>
        </motion.div>
    );
}

export default MailerHeaderTitleComponent;
