import React, {useState} from "react";
import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import TableItemComponent from "./TableItemComponent";

const TableComponent = ({ contacts, setStudents, handleDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const pageCount = Math.ceil(contacts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPageNumbers = () => {
        const pages = [];
        let leftSide = currentPage - 1;
        let rightSide = currentPage + 1;

        if (currentPage > 1) {
            pages.push(
                <button key="firstPage" onClick={() => paginate(1)}>
                    &laquo;
                </button>
            );
        }

        for (let i = leftSide; i <= rightSide; i++) {
            if (i > 0 && i <= pageCount) {
                pages.push(
                    <button key={i} onClick={() => paginate(i)} className={currentPage === i ? "active" : ""}>
                        {i}
                    </button>
                );
            }
        }

        pages.push(
            <button key="lastPage" onClick={() => paginate(pageCount)}>
                &raquo;
            </button>
        );

        return pages;
    };


    return (
        <motion.div
            id={"contactsMotionDiv"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            style={{ textAlign: 'center', width: '100%', margin: '2vh auto', marginTop: '40vh', height: '25%' }}
        >
            <div className={"flex justify-center items-center h-3/12"}>
                <table id={"addressBookTableDiv"} className={"shadow-2xl font-[Poppins] border-2 border-black w-10/12 overflow-hidden inter-font"}>
                    <thead className={"text-white rounded-2xl bg-black"}>
                        <tr className="rounded-2xl">
                            <th className={"py-3 bg-black inter-font"}>№</th>
                            <th className={"py-3 bg-black inter-font"}>Имя и фамилия</th>
                            <th className={"py-3 bg-black inter-font"}>Сайт</th>
                            <th className={"py-3 bg-black inter-font"}>Подробнее</th>
                            <th className={"py-3 bg-black inter-font"}>Удалить</th>
                        </tr>
                    </thead>
                    {currentItems.map((student, index) => (
                        <TableItemComponent
                            id={student.id}
                            key={index}
                            index={index + indexOfFirstItem}
                            student={student}
                            handleDelete={handleDelete}
                        />
                    ))}
                </table>
            </div>
            <div className="pagination flex justify-center">
                {getPageNumbers()}
            </div>
        </motion.div>
    );
}

export default TableComponent;
