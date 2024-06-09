import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React, {useState} from "react";
import { BsArrowRight } from "react-icons/bs";

const InstructionsReadyComponent = ({onNextPage}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [text, setText] = useState("");
    const instructionText = "Инструкции готовы, идем дальше...";

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
            printText(instructionText);
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    const printText = (textToPrint) => {
        let index = 0;
        const printInterval = setInterval(() => {
            setText(textToPrint.slice(0, index + 1));
            index++;
            if (index === textToPrint.length) {
                clearInterval(printInterval);
            }
        }, 100);
    };

    return (
        <motion.div
            id={"InstructionsReady"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: "104vh", margin: '2vh auto' }}
        >
            <h2 className="instructionsReadyText">{text}</h2>
            {inView && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={onNextPage}
                    style={{ border: "none", background: "none", cursor: "pointer" }}
                >
                    <BsArrowRight size={100} style={{ color: 'white' }} />
                </motion.button>
            )}
        </motion.div>
    );
}

export default InstructionsReadyComponent;
