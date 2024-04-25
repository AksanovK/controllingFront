import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import ContactTitleComponent from "../ContactTitleComponent";
import axios from "axios";
import ContactBodyComponent from "../ContactBodyComponent";
import ContactPageComponent from "../ContactPageComponent";
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger);
function ContactPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const index = searchParams.get('id');
    const [contact, setContact] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function () {
            let contactData = await axios.get('/contacts/getContactPage', {
                params: {
                    contactId: index
                }
            });
            if (contactData) {
               setContact(contactData.data);
               setLoading(false);
            }
        })();
    }, []);

    const applicantInfo = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivanov@example.com',
        phone: '+7 (123) 456-78-90',
        address: 'г. Москва, ул. Пушкина, д. 10, кв. 5',
    };

    return loading ? (
        <>
            <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </>
    ) : (
        <ContactPageComponent contact={contact} />
    );
}

export default ContactPage;
