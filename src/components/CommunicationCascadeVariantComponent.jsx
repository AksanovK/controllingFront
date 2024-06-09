import React, {useState} from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import vkImage from "../assets/images/vkImage.svg";
import wsImage from "../assets/images/wsImage.svg";
import tgImage from "../assets/images/tgImage.svg";
import mailImage from "../assets/images/mailImage.svg";
import ImageRow from "./ImageRowComponent";
import ImageRowCascadeComponent from "./ImageRowCascadeComponent";

const CommunicationCascadeVariantComponent= ({ handleNextClick }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();

    const [messengers, setMessengers] = useState([]);
    const handleImageClick = (selectedImages) => {
        handleNextClick(selectedImages);
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

    const images = [
        { src: vkImage, alt: 'vkImage' },
        { src: wsImage, alt: 'wsImage' },
        { src: tgImage, alt: 'tgImage' },
        { src: mailImage, alt: 'mailImage' }
    ];


    return (
        <motion.div
            id={"communicationCascadeVariantMotion"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: '100%', margin: '2vh auto' }}
        >
            <h2 className="instructionTitleNew">Выберите метод связи</h2>
            <div className="image-row-container">
                <ImageRowCascadeComponent images={images} onImageClick={handleImageClick} />
            </div>
        </motion.div>
    );
}

export default CommunicationCascadeVariantComponent;
