import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import studentImage from "../assets/images/students.svg";

const SearchStudentsComponent = () => {
    const { scrollYProgress } = useViewportScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.5, 0.5]);

    return (
        <div style={{ textAlign: 'center', width: '100%', margin: '2vh auto' }}>
            <motion.img
                src={studentImage}
                alt="Student Left"
                style={{ width: '10%', x: '-50%', scale }}
            />
            <motion.img
                src={studentImage}
                alt="Student Center"
                style={{ width: '20%', scale }}
            />
            <motion.img
                src={studentImage}
                alt="Student Right"
                style={{ width: '10%', x: '50%', scale }}
            />
        </div>
    );
}

export default SearchStudentsComponent;
