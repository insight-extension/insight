import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FirstCard } from "../cards-slider/FirstCard";
import ArrowRight from "../../assets/icons/arrow-right.svg";
import { SecondCard } from "../cards-slider/SecondCard";
import { ThirdCard } from "../cards-slider/ThirdCard";
import { FourthCard } from "../cards-slider/FourthCard";
import { FifthCard } from "../cards-slider/FifthCard";

type Card = {
    card: (active: boolean) => JSX.Element;
    id: number;
};
const CARDS: Card[] = [
    {
        card: (active: boolean) => <FirstCard active={active} />,
        id: 1,
    },
    {
        card: (active: boolean) => <SecondCard active={active} />,
        id: 2,
    },
    {
        card: (active: boolean) => <ThirdCard active={active} />,
        id: 3,
    },
    {
        card: (active: boolean) => <FourthCard active={active} />,
        id: 4,
    },
    {
        card: (active: boolean) => <FifthCard active={active} />,
        id: 5,
    },
];

const DESCRIPTIONS_BY_INDEX = [
    "From real-time translations to unmatched security, our tool offers everything you need to navigate the web efficiently, no matter your language or location",
    "Personalize your experience with flexible language choices, ensuring every translation fits your needs in the Web3 world",
    "Effortlessly access real-time translations directly in your browser, ensuring a smooth Web3 experience without disrupting your workflow",
    "Enjoy secure translations with all processes handled locally on your device, ensuring your data stays private and protected",
    "Access translations in over 100 languages with exceptional accuracy, making Web3 platforms truly global and inclusive",
];

const CARD_OFFSET = 60;
const SCALE_FACTOR = 0.08;

const move = (array: Card[], from: number, to: number): Card[] => {
    const newArray = [...array];
    const item = newArray.splice(from, 1)[0];
    newArray.splice(to, 0, item);
    return newArray;
};

export const WhyOur = () => {
    const [cards, setCards] = useState(CARDS);

    const moveToEnd = (from: number) => {
        setCards(move(cards, from, cards.length - 1));
    };

    return (
        <section className="relative overflow-hidden">
            <div className="container relative flex flex-col items-start lg:flex-row">
                <div className="w-full">
                    <h4 className="mb-[30px] max-w-[555px] font-sofiaPro text-2xl font-medium uppercase leading-tight text-white md:text-[76px]">
                        Why Choose{" "}
                        <span className="italic text-green-300">
                            Our Browser
                        </span>{" "}
                        Extension?
                    </h4>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={cards[0].id}
                            className="mb-28 max-w-[427px] text-xl font-medium text-slate-700"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {DESCRIPTIONS_BY_INDEX[cards[0].id - 1]}
                        </motion.p>
                    </AnimatePresence>
                </div>
                <div className="absolute -bottom-12 left-0 inline-flex gap-6 md:-bottom-24 xl:bottom-0">
                    <button className="rounded-[50px] border px-7 py-[14px] opacity-20">
                        <img src={ArrowRight} className="scale-x-[-1]" />
                    </button>
                    <button
                        onClick={() => moveToEnd(0)}
                        className="rounded-[50px] border px-7 py-[14px]"
                    >
                        <img src={ArrowRight} className="" />
                    </button>
                </div>

                <div className="relative flex w-full justify-end md:justify-center lg:block">
                    <ul className="relative h-[460px] md:h-[600px]">
                        {cards.map((card, index) => {
                            const canDrag = index === 0;

                            return (
                                <motion.li
                                    key={card.id}
                                    className="absolute mt-5 lg:mt-0"
                                    style={{
                                        cursor: canDrag ? "grab" : "auto",
                                    }}
                                    animate={{
                                        right: index * -CARD_OFFSET,

                                        scale: 1 - index * SCALE_FACTOR,
                                        zIndex: cards.length - index,
                                        rotate: index * 5,
                                    }}
                                    drag={canDrag ? "x" : false}
                                    dragConstraints={{
                                        left: 0,
                                        right: 0,
                                    }}
                                    onDragEnd={() => {
                                        moveToEnd(index);
                                    }}
                                >
                                    {card.card(index === 0)}
                                </motion.li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
};
