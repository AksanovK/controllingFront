import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import LupaIcon from "../assets/images/lupasearch.svg";

export default function SearchFiltersComponent({startSearch}) {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [filters, setFilters] = useState([
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
    ]);

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const handleCheckboxChange = (sectionId, optionValue) => {
        setFilters(currentFilters => currentFilters.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    options: section.options.map(option => {
                        if (option.value === optionValue) {
                            return { ...option, checked: !option.checked };
                        }
                        return option;
                    })
                };
            }
            return section;
        }));
    };

    const variants = {
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
        hidden: { opacity: 0, scale: 0.95 }
    };

    return (
        <motion.div
            id={"searchFiltersAnimDiv"}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className={"text-center h-auto w-full inset-0 flex justify-center items-center transition-colors"}
            style={{marginTop: '80vh'}}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="mx-auto bg-white rounded-xl p-16 w-2/3 shadow-2xl">
                <form className="text-center">
                    {filters.map((section) => (
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
                                                        checked={option.checked}
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
                    ))}
                    <button type={"button"} onClick={() => startSearch()} className="mt-10 justify-center align-items-center w-52
                        h-14 bg-black text-white inter-font-bold border-5 border-black rounded-2" aria-label="Начать поиск">
                            Начать
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
