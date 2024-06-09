import React, { useEffect, useState } from 'react';
import SearchHeaderTitleComponent from "../SearchHeaderTitleComponent";
import SearchProcessAnimComponent from "../SearchProcessAnimComponent";
import SearchFiltersComponent from "../SearchFiltersComponent";
import LoadingTestPage from "./LoadingTestPage";
import LoadingPage from "./LoadingPage";

function SearchPage() {
    const [animate, setAnimate] = useState(false);
    const [initialScrollDone, setInitialScrollDone] = useState(false);
    const [isLoadingFinished, setIsLoadingFinished] = useState(false);
    const [selectedTargetGroup, setSelectedTargetGroup] = useState(null);
    const [selectedCriteria, setSelectedCriteria] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSearchStarted, setIsSearchStarted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToElementWithId = (id) => {
        setAnimate(false);
        setTimeout(() => {
            setAnimate(true);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            setTimeout(() => {
                setAnimate(false);
            }, 100);
        }, 10);
    };

    const handleSearch = () => {
        scrollToElementWithId("searchFiltersAnimDiv");
    };

    const startSearch = () => {
        let isRight = false;
        let missingFields = [];

        if (!selectedTargetGroup) {
            missingFields.push("Целевая группа");
        } else {
            if (!selectedCriteria) {
                missingFields.push("Критерии");
            } else if (selectedCriteria === 'olympics' && !selectedSubject) {
                missingFields.push("Предмет");
            }
        }

        if (missingFields.length === 0) {
            isRight = true;
            setInitialScrollDone(true);
            setIsSearchStarted(true);
            setTimeout(() => {
                if (!isLoadingFinished) {
                    scrollToElementWithId("loadingDivId1");
                } else {
                    scrollToElementWithId("loadingDivId2");
                }
            }, 100);
        }

        if (!isRight) {
            setErrorMessage(`Пожалуйста, заполните следующие поля: ${missingFields.join(', ')}`);
            setTimeout(() => setErrorMessage(""), 3000); // Убираем сообщение через 3 секунды
        }
    };

    return (
        <div className="searchPageDiv h-fit">
            {errorMessage && (
                <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white py-2 px-4 rounded shadow-md z-50">
                    {errorMessage}
                </div>
            )}
            <div className="searchHeaderDiv">
                <SearchHeaderTitleComponent handleSearch={handleSearch} />
            </div>
            <div className="mb-52 min-h-96">
                <SearchFiltersComponent
                    startSearch={startSearch}
                    selectedSubject={selectedSubject}
                    selectedTargetGroup={selectedTargetGroup}
                    selectedCriteria={selectedCriteria}
                    setSelectedSubject={setSelectedSubject}
                    setSelectedTargetGroup={setSelectedTargetGroup}
                    setSelectedCriteria={setSelectedCriteria}
                    isDisabled={isSearchStarted}
                    handleSearch={handleSearch}
                />
            </div>
            {initialScrollDone ?
                (<div id="searchProcessDiv" className="searchProcessDiv">
                    <LoadingTestPage setIsLoadingFinished={setIsLoadingFinished} isLoadingFinished={isLoadingFinished} selectedSubject={selectedSubject} selectedCriteria={selectedCriteria}/>
                </div>)
                :
                null
            }
        </div>
    );
}

export default SearchPage;
