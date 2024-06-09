import './index.css';
import { X } from "react-feather"
export default function AcceptWindow({ open, onClose, children }) {
    return (
        <div
            onClick={onClose}
            className={`
        fixed inset-0 flex justify-center items-center transition-colors z-10
        ${open ? "visible bg-black/10" : "invisible"}
      `}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
          absolute bg-black rounded-xl p-12 w-1/3 transition-all shadow-2xl blur-lg
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
            ><button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-lg text-white  hover:bg-gray-900 hover:text-gray-600"
            >
                <X />
            </button>
                <div className="mx-auto">
                    {children}
                </div></div>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
          relative bg-black rounded-xl p-12 w-1/3 transition-all shadow-2xl
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
            >

                <div className="mx-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
