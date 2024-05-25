import './index.css';
import { motion } from "framer-motion";
import { X } from "react-feather";

const modalVariants = {
    open: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,  // Уменьшена жесткость
            damping: 10       // Уменьшено демпфирование
        }
    },
    closed: {
        scale: 1.25,
        opacity: 0,
        transition: {
            duration: 0.75   // Увеличена длительность
        }
    }
};

export default function CreateMailWindow({ open, onClose, children }) {
    return (
        <motion.div
            onClick={(e) => e.stopPropagation()}
            className={`
                fixed inset-0 flex justify-center items-center transition-colors
                ${open ? "visible bg-gray-900/30" : "invisible"}
            `}
            variants={modalVariants}
            initial="closed"
            animate={open ? "open" : "closed"}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    bg-black rounded-xl p-12 w-1/3 transition-all shadow-2xl
                    ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-lg text-white hover:bg-gray-900 hover:text-gray-600"
                >
                    <X />
                </button>
                <div className="mx-auto">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
