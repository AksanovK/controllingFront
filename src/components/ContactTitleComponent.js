import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React from "react";
import maleIcon from "../assets/images/male.svg";
import femaleIcon from "../assets/images/female.svg";
import deleteIcon from "../assets/images/deleteIcon.svg";

const ContactTitleComponent = ({ name, gender }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView()


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
            id={"contactTitleDiv"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: '100%', margin: '2vh auto' }}
        >
            <img src={gender === 'MALE' ? maleIcon : femaleIcon} alt="Delete" className="contactTitleIcon" />
            <h2 className="contactName">{name}</h2>
        </motion.div>)
}

export default ContactTitleComponent;
