import { useState } from "react";
import { Accordion } from "../Accordion";
const accordions = [
    {
        title: "How does the browser extension work?",
        description:
            "The extension provides real-time translation content directly in your browser, enabling seamless communication and interaction across multiple languages.",
    },
    {
        title: "What languages are supported?",
        description:
            "We support a wide range of languages, including major global languages like English, Spanish, Chinese, French, and more, with regular updates to add new ones.",
    },
    {
        title: "Is my data safe while using the extension?",
        description:
            "Yes, your data is secure. The extension does not collect or store any personal information, ensuring your privacy and security.",
    },
    {
        title: "Can I use this on multiple devices?",
        description:
            "Yes, the extension can be installed and used on multiple devices as long as they support your preferred browser.",
    },
    {
        title: "How accurate are the translations?",
        description:
            "The translations are powered by advanced AI, providing high accuracy, especially for casual conversations.",
    },
];
export const Faqs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleAccordionClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (
        <>
            <section className="mt-[170px]" id="faqs">
                <div className="container">
                    <article className="mb-16">
                        <h2 className="font-sofiaPro text-[76px] font-medium">
                            FAQS
                        </h2>
                    </article>
                    <article className="">
                        <div className="ml-auto w-full max-w-[872px]">
                            {accordions.map((accordion, index) => (
                                <Accordion
                                    key={index}
                                    title={accordion.title}
                                    description={accordion.description}
                                    isOpen={openIndex === index}
                                    onClick={() => handleAccordionClick(index)}
                                />
                            ))}
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
};
