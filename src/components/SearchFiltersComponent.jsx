import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";

export default function SearchFiltersComponent({
                                                   startSearch,
                                                   selectedTargetGroup,
                                                   selectedCriteria,
                                                   selectedSubject,
                                                   setSelectedTargetGroup,
                                                   setSelectedCriteria,
                                                   setSelectedSubject,
                                                   isDisabled,
                                                   handleSearch
                                               }) {
    const controls = useAnimation();
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const handleCheckboxChange = (sectionId, optionValue) => {
        if (isDisabled) return; // Блокировка изменения фильтров при активном поиске

        if (sectionId === 'color') {
            setSelectedTargetGroup(optionValue === selectedTargetGroup ? null : optionValue);
            setSelectedCriteria(null);
            setSelectedSubject(null);
        } else if (sectionId === 'category') {
            setSelectedCriteria(optionValue === selectedCriteria ? null : optionValue);
            setSelectedSubject(null);
        } else if (sectionId === 'size') {
            setSelectedSubject(optionValue === selectedSubject ? null : optionValue);
        }
        setTimeout(() => {
            handleSearch();
        }, 1000);
    };

    const filters = [
        {
            id: 'color',
            name: 'Целевая группа',
            options: [
                { value: 'searchStudents', label: 'Поиск абитуриентов', checked: true }
            ],
        },
        {
            id: 'category',
            name: 'Критерии',
            options: [
                { value: 'olympics', label: 'Олимпиады', checked: false },
                { value: 'scientific', label: 'Научные конференции и исследования', checked: false },
            ],
        },
        {
            id: 'size',
            name: 'Предмет',
            options: [
                { value: 'mathematics', label: 'Математика', checked: false },
                { value: 'informatics', label: 'Информатика', checked: false },
                { value: 'physics', label: 'Физика', checked: false },
            ],
        },
    ];

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    return (
        <motion.div
            id="searchFiltersAnimDiv"
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className="text-center h-auto w-full inset-0 flex justify-center items-center transition-colors"
            style={{ marginTop: '80vh' }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`mx-auto bg-white rounded-xl p-16 w-2/3 shadow-2xl ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <form className="text-center">
                    {filters.map((section) => {
                        if (section.id === 'color' ||
                            (section.id === 'category' && selectedTargetGroup) ||
                            (section.id === 'size' && selectedCriteria === 'olympics')) {
                            return (
                                <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                    {({ open }) => (
                                        <>
                                            <h3 className="flow-root">
                                                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                    <span className="text-xl inter-font text-gray-900">{section.name}</span>
                                                    <span className="ml-1 flex items-center">
                                                        {open ? (
                                                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                        ) : (
                                                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                        )}
                                                    </span>
                                                </Disclosure.Button>
                                            </h3>
                                            <Disclosure.Panel className="pt-1">
                                                <div className="space-y-1">
                                                    {section.options.map((option, optionIdx) => (
                                                        <div key={option.value} className="flex items-center">
                                                            <input
                                                                id={`filter-${section.id}-${optionIdx}`}
                                                                name={`${section.id}[]`}
                                                                defaultValue={option.value}
                                                                type="checkbox"
                                                                checked={
                                                                    section.id === 'color'
                                                                        ? selectedTargetGroup === option.value
                                                                        : section.id === 'category'
                                                                            ? selectedCriteria === option.value
                                                                            : selectedSubject === option.value
                                                                }
                                                                onChange={() => handleCheckboxChange(section.id, option.value)}
                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <label
                                                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                className="ml-3 text-xl inter-font-thin text-gray-600"
                                                            >
                                                                {option.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            );
                        }
                        return null;
                    })}
                    <button
                        type="button"
                        onClick={startSearch}
                        className={`mt-10 justify-center align-items-center w-52 h-14 bg-black text-white inter-font-bold border-5 border-black rounded-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-label="Начать поиск"
                        disabled={isDisabled}
                    >
                        Начать
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
