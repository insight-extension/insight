import { useRef, useState, KeyboardEvent, RefObject } from "react";

import { Logo, Button, UpcomingSoonBadge } from "@/components";
import Kumeka from "@/assets/icons/Kumeka.svg";
import Solana from "@/assets/icons/Solana.svg";
import Insta from "@/assets/icons/insta.svg";
import Twitter from "@/assets/icons/twiter.svg";
import Linked from "@/assets/icons/linked.svg";

export const Footer = () => {
    const emailRef = useRef(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isChecked, setIsChecked] = useState(false);

    const handleKeyDown = (
        e: KeyboardEvent,
        nextRef: RefObject<HTMLElement>
    ) => {
        if (e.key === "Enter" && nextRef && nextRef.current) {
            e.preventDefault();
            nextRef.current.focus();
        }
    };

    const isFormValid = name && email && isChecked;

    return (
        <footer className="container mb-24 mt-36">
            <Logo className="mb-14 w-[226px]" />
            <article className="flex flex-wrap justify-between gap-5">
                <div>
                    <div className="mb-[70px] flex flex-wrap gap-20">
                        <ul className="flex flex-col gap-6 text-lg leading-none">
                            <li className="leading-none">How It Works?</li>
                            <li className="leading-none">Features</li>
                            <li className="leading-none">Pricing</li>
                            <li className="leading-none">FAQs</li>
                        </ul>

                        <ul className="flex flex-col gap-6 text-lg leading-none">
                            <li className="leading-none">Privacy Policy</li>
                            <li className="leading-none">Terms of Service</li>
                            <li className="flex gap-7 leading-none">
                                <a
                                    href="https://kumeka.team/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={Kumeka} />
                                </a>
                                <a
                                    href="https://solana.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={Solana} />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex gap-8">
                        <a
                            href="https://www.instagram.com/1nsight.xyz/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={Insta}
                                className="h-auto w-[40x]"
                                alt="Instagram"
                            />
                        </a>
                        <a
                            href="https://x.com/1nsight_xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={Twitter}
                                className="h-auto w-[40x]"
                                alt="Twitter"
                            />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/insight-xyz/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={Linked}
                                className="h-auto w-[40x]"
                                alt="LinkedIn"
                            />
                        </a>
                    </div>
                </div>

                <form className="relative -order-1 w-full max-w-[487px] lg:order-none">
                    <UpcomingSoonBadge className="-top-2 right-0" />

                    <div className="relative mb-6 ml-6 max-w-[356px] text-3xl before:absolute before:-left-6 before:top-3 before:h-[12px] before:w-[12px] before:rounded-full before:bg-white before:content-[''] md:ml-0">
                        Subscribe to get the latest updates
                    </div>
                    <input
                        type="text"
                        className="mb-[10px] block w-full rounded-[32px] border border-white bg-transparent px-[20px] py-[17px] text-white placeholder:text-white"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, emailRef)}
                    />
                    <input
                        type="email"
                        ref={emailRef}
                        className="mb-[10px] block w-full rounded-[32px] border border-white bg-transparent px-[20px] py-[17px] text-white placeholder:text-white"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="mb-4 flex items-center gap-2">
                        <label className="flex cursor-pointer place-items-center items-center gap-2">
                            <div className="grid place-items-center">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    className="peer col-start-1 row-start-1 h-3 w-3 shrink-0 cursor-pointer appearance-none rounded-full border border-white"
                                    checked={isChecked}
                                    onChange={(e) =>
                                        setIsChecked(e.target.checked)
                                    }
                                />
                                <div className="col-start-1 row-start-1 h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                            </div>
                            <span className="text-start align-middle">
                                I agree with the privacy statement
                            </span>
                        </label>
                    </div>
                    {isFormValid && (
                        <Button variant="button-white">Submit</Button>
                    )}
                </form>
            </article>
        </footer>
    );
};
