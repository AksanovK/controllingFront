import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './share.css';

import layer1 from '../../assets/images/sharekfuback.svg';
import layer2 from '../../assets/images/kfulogoblue.svg';
import telegramIcon from '../../assets/images/tgSmallIcon.svg';
import whatsappIcon from '../../assets/images/wsSmallIcon.svg';
import vkIcon from '../../assets/images/vkSmallIcon.svg';
import mailIcon from '../../assets/images/mailSmallIcon.svg';
import {Mail} from "react-feather";
import AcceptWindow from "../AcceptWindow";

const SharePage = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            document.documentElement.style.setProperty('--move-x-share', `${(e.clientX - window.innerWidth / 2) * -.005}deg`);
            document.documentElement.style.setProperty('--move-y-share', `${(e.clientY - window.innerHeight / 2) * .01}deg`);
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleIconClick = async (messenger) => {
        if (messenger !== 'EMAIL') {
            try {
                const response = await axios.get('api/settings/getSubscriptionLink', {
                    params: { messenger }
                });
                if (response.status === 200) {
                    const link = response.data;
                    window.open(link, '_blank', 'noopener,noreferrer');
                } else {
                    console.error(`Error fetching link for ${messenger}`);
                }
            } catch (error) {
                console.error(`Error fetching link for ${messenger}:`, error);
            }
        } else {
            setOpen(true);
        }
    };

    const handleSubscribe = () => {
        console.log("Subscribed with email:", email);
        setOpen(false);
    };

    return (
        <section className={`layers-share `}>
            <div className={`layers__container-share ${open ? 'bg-light-gray' : ''}`}>
                <div className="layers__item-share layer-1-share mx-auto my-auto opacity-20" style={{ height: '120vh', width: '120vh', backgroundImage: `url(${layer1})` }}></div>
                <div className="layers__item-share mx-auto my-auto layers__item layer-2" style={{ height: '50vh', width: '50vh', backgroundImage: `url(${layer2})` }}></div>
                <div className="layers__item-share mb-24 layer-3-share">
                    <div className="hero-content-share ">
                        <h1 className={"inter-font-bold"}>subscribe to mailer</h1>
                        <div className="messengers-share">
                            <div className="messenger-share" onClick={() => handleIconClick('Telegram')}>
                                <img
                                    src={telegramIcon}
                                    alt="Telegram"
                                    className="messenger-icon-share rounded-3xl border-8 border-r-white"
                                />
                                <span className="inter-font-bold messenger-name-share">Telegram</span>
                            </div>
                            <div className="messenger-share" onClick={() => handleIconClick('WhatsApp')}>
                                <img
                                    src={whatsappIcon}
                                    alt="WhatsApp"
                                    className="messenger-icon-share"
                                />
                                <span className="inter-font-bold messenger-name-share">WhatsApp</span>
                            </div>
                            <div className="messenger-share row-" onClick={() => handleIconClick('VK')}>
                                <img
                                    src={vkIcon}
                                    alt="VK"
                                    className="messenger-icon-share rounded-3xl border-8 border-r-white"
                                />
                                <span className="inter-font-bold messenger-name-share">VK</span>
                            </div>
                            <div className="messenger-share row-" onClick={() => handleIconClick('EMAIL')}>
                                <img
                                    src={mailIcon}
                                    alt="EMAIL"
                                    className="messenger-icon-share emailShareIcon p-2 rounded-3xl border-8 border-r-white"
                                />
                                <span className="inter-font-bold messenger-name-share">EMAIL</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="layers__item-share layer-4-share">
                    <canvas className="rain-share"></canvas>
                </div>
            </div>
            <AcceptWindow open={open} onClose={() => setOpen(false)}>
                <div className="text-center inter-font w-auto">
                    <Mail size={56} className="mx-auto text-white" />
                    <div className="mx-auto">
                        <h3 className="relative text-3xl font-black text-white mt-3">Подпишитесь на рассылку</h3>
                        <input
                            type="email"
                            placeholder="Адрес электронной почты"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-4 text-black rounded-md mb-4 bg-white"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <button
                            className="btn inter-font btn-dark w-full hover:bg-gray-200 hover:text-black"
                            onClick={handleSubscribe}
                            disabled={!consent}
                        >
                            Подписаться
                        </button>
                        <div className="mx-auto flex items-center mt-4 justify-center">
                            <input type="checkbox" id="consent" className="mr-2" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                            <label htmlFor="consent" className="text-sm text-gray-200 text-center">Я согласен получать рассылку от Mailer <br /> (отписаться можно в любое время)</label>
                        </div>
                    </div>
                </div>
            </AcceptWindow>
        </section>
    );
};

export default SharePage;
