import bg from "../assets/images/noiseForStroke.svg";
import './index.css';
import maleIcon from "../assets/images/male.svg";
import femaleIcon from "../assets/images/female.svg";
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, {useLayoutEffect, useRef} from "react";
import mailIcon from "../assets/images/mailSmallIcon.svg";
import vkIcon from "../assets/images/vkSmallIcon.svg";
import wsIcon from "../assets/images/wsSmallIcon.svg";
import telegramIcon from "../assets/images/tgSmallIcon.svg";
import {format, parseISO} from "date-fns";
import ContactInfoCardComponent from "./ContactInfoCardComponent";
import ContactInfoContactsComponent from "./ContactInfoContactsComponent";
gsap.registerPlugin(ScrollTrigger);
const ContactPageComponent = ({contact}) => {
    const bg1 = useRef(null);
    const img_container = useRef(null);
    const img = useRef(null);
    const text1 = useRef(null);
    const text2 = useRef(null);
    const container = useRef(null);
    const container2 = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: bg1.current,
                pin: bg1.current,
                pinSpacing: false,
                start: "top top",
                endTrigger: ".last",
                end: "bottom bottom"
            });

            gsap.set(container.current, {
                marginTop: - (container.current.offsetHeight)
            });

            gsap.timeline({
                scrollTrigger: {
                    trigger:img_container.current,
                    pin: img_container.current,
                    scrub: 3,
                    start: "0% 0%",
                },
            })
                .to(img.current, { transform: "translateZ(2200px)" }, 0)
                .to(text1.current, {y:-800}, 0.05 , "<")
                .to(text2.current, {y:-800}, 0.08, "<")
                .to(container.current, {y:-500}, 0.08, "<")
                .fromTo(container2.current, {yPercent: 100, scaleY: 2}, {yPercent: 0, scaleY: 1});
        });
        return () => ctx.revert();
    },[])

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

    const formattedDate = contact.birthday ? format(parseISO(contact.birthday), 'dd.MM.yyyy') : "-";

    return ( <>
        <div className={"relative bg-[#444]"}>
            <div ref={bg1}
                 className={"bg bg-[#444] absolute h-screen w-screen z-[-1]"}
            ></div>
                <section className={"bg-white"}>
                    <div ref={img_container} className="perspective img-container flex items-center justify-center h-screen w-screen">
                        <img ref={img} className="image" src={bg} alt=""/>
                        <div className={"text-black absolute flex flex-col items-center justify-center"}>
                            <img ref={text1} src={contact.gender === 'MALE' ? maleIcon : femaleIcon} alt="Gender Icon"
                            className={"contactPageAvatar"}/>
                            <h1 ref={text2} className={"text-[90px] text-stroke raleway-1"}>
                                {contact.firstName} {" "} {" "}
                                {contact.lastName}
                            </h1>
                        </div>
                    </div>

                    <div ref={container} className={"container py-12 flex flex-wrap items-center justify-around"}>
                        <ContactInfoCardComponent gender={contact.gender} formattedDate={formattedDate} additionalInfo={contact.additionalInfo}/>
                    </div>
                    <div ref={container2} className={"container py-12 flex flex-wrap items-center justify-around"}>
                        <ContactInfoContactsComponent contact={contact} />
                        {/*<div className="contactAddress">*/}
                        {/*    <h3>Контактная информация</h3>*/}
                        {/*    <ul>*/}
                        {/*        {contact.contactInfo.map((info, index) => (*/}
                        {/*            <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '2vh', marginTop: '5vh' }}>*/}
                        {/*                <img src={convertImage(info.type)} alt={info.type} style={{ width: '12vh', height: '12vh', marginRight: '10px' }} />*/}
                        {/*                <span>{info.type === 'VK' ? 'https://vk.com/' + info.value : info.value}</span>*/}
                        {/*            </li>*/}
                        {/*        ))}*/}
                        {/*    </ul>*/}
                        {/*</div>*/}
                    </div>
                </section>
        </div>
    </>);
}

export default ContactPageComponent;
