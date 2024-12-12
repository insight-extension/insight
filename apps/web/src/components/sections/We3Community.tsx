import Web3 from "../../assets/images/Insight WEB3 Group 12.png";
import Mac from "../../assets/images/mac-with-extansion.webp";

import Carousel from "../../assets/images/Group 11.png";

import Edge from "../../assets/icons/Browser Edge.svg";
import Chrome from "../../assets/icons/Chrome Fill.svg";
import Firefox from "../../assets/icons/Firefox Browser Icon.svg";

import { Button } from "../Button";
import { motion } from "framer-motion";

export const Web3Community = () => {
    return (
        <>
            <section className="mt-44" id="features">
                <div className="container mb-28">
                    <div className="mb-52 flex flex-col-reverse justify-between gap-7 lg:flex-row">
                        <div className="basis-full">
                            <div className="mb-8 md:mb-[280px]">
                                <h4 className="mb-8 max-w-[495px] text-3xl font-medium text-white">
                                    Join the future of communication with a tool
                                    that’s Web3-ready!
                                </h4>
                                <p className="max-w-[445px] text-xl font-medium text-slate-700">
                                    Our platform is designed to meet the needs
                                    of the Web3 Community, offering real-time
                                    translation and privacy-focused features
                                    that ensure secure, decentralized
                                    interactions
                                </p>
                            </div>
                            <Button variant="button-dark-border">
                                Web3 Community
                            </Button>
                        </div>

                        <article className="relative h-[400px] w-full md:h-[540px]">
                            <img
                                src={Web3}
                                className="absolute left-1/2 top-[20%] w-[400px] -translate-x-1/2 lg:-top-1/3 lg:w-auto lg:max-w-[800px]"
                            />
                            <motion.img
                                initial={{ opacity: 0 }}
                                transition={{ delay: 0.3, duration: 2 }}
                                src={Carousel}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="absolute bottom-0 left-1/2 w-[400px] -translate-x-1/2 lg:top-1/4 lg:w-auto lg:max-w-[800px]"
                            />
                        </article>
                    </div>
                    <div className="">
                        <p className="mb-6 max-w-[428px] text-xl font-medium text-slate-700">
                            Experience seamless browsing with our advanced
                            extension designed to enhance your online experience
                        </p>
                        <div className="flex flex-wrap gap-[15px]">
                            <div className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white">
                                <img
                                    src={Edge}
                                    alt=""
                                    className="h-[24px] w-[24px] shrink-0"
                                />
                            </div>
                            <div className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white">
                                <img
                                    src={Chrome}
                                    alt=""
                                    className="h-[24px] w-[24px] shrink-0"
                                />
                            </div>
                            <div className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white">
                                <img
                                    src={Firefox}
                                    alt=""
                                    className="h-[24px] w-[24px] shrink-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <img
                    src={Mac}
                    alt="Extension"
                    className="ml-auto max-w-[85%]"
                    loading="lazy"
                />
            </section>
        </>
    );
};
