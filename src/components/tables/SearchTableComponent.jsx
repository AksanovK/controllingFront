import React, {useState} from "react";
import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import TableItemComponent from "./TableItemComponent";
import SearchTableItemComponent from "./SearchTableItemComponent";

const SearchTableComponent = ({ contacts, handleDetails, currentPage, indexOfFirstItem, indexOfLastItem }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);

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
            id={"contactsMotionDiv"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: '100%', height: '100%'}}
        >
            <div style={{height: '100%'}} className={"justify-center items-center rounded-xl"}>
                <table style={{height: '100%'}} id={"addressBookTableDiv"} className={"shadow-2xl font-[Poppins] border-1 border-black w-full overflow-hidden inter-font rounded-2xl"}>
                    <thead className={"text-white rounded-2xl bg-black"}>
                    <tr className="rounded-2xl">
                        <th className={"py-3 bg-black inter-font"}>№</th>
                        <th className={"py-3 bg-black inter-font"}>Имя и фамилия</th>
                        <th className={"py-3 bg-black inter-font"}>Предполагаемый способ связи</th>
                        <th className={"py-3 bg-black inter-font"}>Подробнее</th>
                    </tr>
                    </thead>
                    {currentItems.map((student, index) => (
                        <SearchTableItemComponent
                            id={student.id}
                            key={index}
                            index={index + indexOfFirstItem}
                            student={student}
                            handleDetails={handleDetails}
                        />
                    ))}
                </table>
            </div>
        </motion.div>
    );
}

export default SearchTableComponent;
