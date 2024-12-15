import { motion } from "framer-motion";

import { cn } from "@/lib";

import Plus from "../assets/icons/plus.svg";
import Minus from "../assets/icons/minus.svg";

type AccordionProps = React.HTMLProps<HTMLDivElement> & {
    isOpen: boolean;
    title: string;
    description: string;
};

export const Accordion = ({
    isOpen,
    title,
    description,
    onClick,
}: AccordionProps) => {
    return (
        <>
            <div className="border-b-[0.7px] border-slate-700">
                <div
                    className={cn(
                        "flex w-full cursor-pointer items-center justify-between py-5",
                        {
                            "pb-[10px]": isOpen,
                        }
                    )}
                    onClick={onClick}
                >
                    <span className="font-fixel text-xl font-normal text-white md:text-[30px]">
                        {title}
                    </span>

                    {!isOpen && <img src={Plus} alt="" />}
                    {isOpen && <img src={Minus} alt="" />}
                </div>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <p className="max-w-[473px] pb-5 font-fixel text-lg text-slate-700 md:text-[20px]">
                        {description}
                    </p>
                </motion.div>
            </div>
        </>
    );
};
