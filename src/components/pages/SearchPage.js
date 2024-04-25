import React, {useEffect, useState} from 'react';
import SearchHeaderTitleComponent from "../SearchHeaderTitleComponent";
import SearchProcessAnimComponent from "../SearchProcessAnimComponent";

function SearchPage() {
    const [animate, setAnimate] = useState(false);
    const [initialScrollDone, setInitialScrollDone] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            setInitialScrollDone(true); // Устанавливаем флаг после завершения скролла
        }, 100); // Даем небольшую задержку для гарантии, что скролл завершился
    }, []);
    const scrollToElementWithId = (id) => {
        if (!initialScrollDone) return; // Не выполняем скролл до элемента, пока начальный скролл не завершен

        setAnimate(false);
        setTimeout(() => {
            setAnimate(true);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            setTimeout(() => {
                setAnimate(false);
            }, 100);
        }, 10);
    };

    const handleSearch = () => {
        scrollToElementWithId("searchProcessDiv");
    };

    return (
        <div className="searchPageDiv">
            <div className={"searchHeaderDiv"}>
                <SearchHeaderTitleComponent handleSearch={handleSearch}/>
            </div>
            {/*<div className={"searchProcessDiv"}>*/}
            {/*    <SearchStudentsComponent />*/}
            {/*</div>*/}
            {initialScrollDone ? <div className={"searchProcessDiv"}>
                <SearchProcessAnimComponent />
            </div> : <></>}
        </div>
    );
}

export default SearchPage;
