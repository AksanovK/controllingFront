import React from "react";

export default function ContactInfoCardComponent({ gender, formattedDate, additionalInfo }) {
    return (
        <div className={`fixed inset-0 flex justify-center items-center transition-colors`}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    bg-black rounded-xl p-12 w-2/3 transition-all  shadow-black shadow-2xl max-w-6xl overflow-hidden`}>
                <div>
                    <div className="ms-auto mb-auto w-auto">
                        <div className="mx-auto ms-auto" style={{ maxWidth: '800px' }}>
                            <h3 className="relative text-start text-5xl font-black text-white mt-3 mb-11">Краткая информация</h3>
                            <p className="relative text-start inter-font text-3xl text-gray-200 mt-3 mb-4">
                                Пол: {gender === 'MALE' ? 'Мужской' : 'Женский'}
                            </p>
                            <p className="relative text-start inter-font text-3xl text-gray-200 mt-3 mb-4">
                                Дата рождения: {formattedDate}
                            </p>
                            <p className="relative max-w-3xl text-start inter-font text-3xl text-gray-200 mt-3 mb-4">
                                Дополнительная информация: {additionalInfo}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
