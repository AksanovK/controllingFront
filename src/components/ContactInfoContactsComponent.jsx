import React from "react";
import mailIcon from "../assets/images/mailSmallIcon.svg";
import vkIcon from "../assets/images/vkSmallIcon.svg";
import wsIcon from "../assets/images/wsSmallIcon.svg";
import telegramIcon from "../assets/images/tgSmallIcon.svg";

export default function ContactInfoContactsComponent({ contact }) {
    const convertImage = (value) => {
        switch (value) {
            case "EMAIL":
                return mailIcon;
                break;
            case "VK":
                return vkIcon;
                break;
            case "WHATSAPP":
                return wsIcon;
                break;
            case "TELEGRAM":
                return telegramIcon;
                break;
            default:
                return mailIcon;
                break;
        }
    }

    return (
        <div className={`shadow-3xl flex w-auto justify-center items-center transition-colors mb-12`}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                relative shadow-black bg-black rounded-xl p-12 w-2/3 transition-all shadow-2xl max-w-6xl overflow-hidden`}>
                <div>
                    <div className="ms-auto mb-auto w-auto">
                        <div className="row mx-auto ms-auto flex flex-row items-center" >
                            <h3 className="relative text-center text-5xl font-black text-white mt-3 mb-12">Контактная информация</h3>
                            {contact.contactInfo.map((info, index) => (
                                <li className={"flex items-center mb-12"} key={index}>
                                    <img src={convertImage(info.type)} alt={info.type} className={"w-20 mr-10"} />
                                    <span className={"text-start inter-font text-3xl text-gray-200 mt-3 mb-4"}>{info.type === 'VK' ? 'https://vk.com/' + info.value : info.value}</span>
                                </li>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

