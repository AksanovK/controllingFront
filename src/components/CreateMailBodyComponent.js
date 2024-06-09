import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React from "react";

const CreateMailBodyComponent = ({ fixMessage, fixSubject, selectedIcon, handleSubmit }) => {
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
            id={"communicationVariantMotion"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={"animationCreateMailDiv"}
        >
            {selectedIcon === 'mailImage' ? (<div className="subjectDiv">
                <input
                    type="text"
                    placeholder="Subject"
                    className="inputField"
                    onChange={(e) => fixSubject(e)}
                />
            </div>) : (<></>)}
            <div className="bodyDiv">
                <textarea
                    placeholder="Body"
                    rows="4"
                    className="textareaField"
                    onChange={(e) => fixMessage(e)}
                />
            </div>
            <div className="sendMessageButtonDiv">
                <button onClick={handleSubmit} className="sendMessageButton">
                    Отправить
                </button>
            </div>
        </motion.div>
    );
}

export default CreateMailBodyComponent;
