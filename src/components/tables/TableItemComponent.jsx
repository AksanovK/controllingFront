import {useNavigate} from "react-router-dom";
import {BsArrowRight} from "react-icons/bs";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import React from "react";
import '../index.css';

const TableItemComponent = ({ id, student, index, handleDelete }) => {
    const goToContactPage = () => {
        window.open(`/contact?id=${id}`, '_blank');
    }
    return (
        <tbody className={"text-black text-center rounded-2xl"}>
        <tr className={`hover:bg-gray-50 cursor-pointer duration-300 ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`} key={index}>
            <td className={"py-3 px-3 inter-font "}>{index + 1}</td>
            <td className={"py-3 px-3 inter-font "}>{student.firstName} {student.lastName}</td>
            <td className={"py-3 px-3 inter-font custom-table-cell-link"}><a href={student.website} target="_blank" rel="noopener noreferrer">{student.website}</a></td>
            <td className={"py-3 px-3 flex justify-center items-center"}>
                <button className="table-button-next">
                    <BsArrowRight size={40} style={{ color: 'white' }} onClick={goToContactPage} />
                </button>
            </td>
            <td className="py-3">
                <button className="table-button" onClick={() => handleDelete(id)}>
                    <img src={deleteIcon} alt="Delete" className="contactTableIcon" />
                </button>
            </td>
        </tr>
        </tbody>
    );
}

export default TableItemComponent;

