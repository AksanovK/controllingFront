import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import React from "react";
import LupaIcon from "../assets/images/lupasearch.svg";

const SearchHeaderTitleComponent = ({ handleSearch }) => {
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
            id={"searchHeaderId"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '2vh auto'
            }}
        >
            <h2 className="searchTitle">Поиск новых <br/> контактов</h2>
            <button onClick={handleSearch} className="searchButton" aria-label="Начать поиск">
                <img src={LupaIcon} alt="Поиск" />
            </button>
        </motion.div>
    );
}

export default SearchHeaderTitleComponent;
