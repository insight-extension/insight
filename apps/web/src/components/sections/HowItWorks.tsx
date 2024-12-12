import DeutschlandIcon from "../../assets/icons/Deutschland.svg";
import FranceIcon from "../../assets/icons/France.svg";
import SpainIcon from "../../assets/icons/Spain.svg";
import USAIcon from "../../assets/icons/USA.svg";

import Line from "../../assets/icons/line.svg";

import Noodle from "../../assets/images/Noodle.webp";

export const HowItWorks = () => {
    return (
        <section className="mb-32" id="howItWork">
            <div className="container">
                <div className="mb-6">
                    <h5 className="mb-2 font-sofiaPro text-2xl font-medium uppercase leading-snug text-white md:text-[76px]">
                        How It{" "}
                        <span className="italic text-green-300">Works?</span>
                    </h5>
                    <p className="max-w-[531px] font-fixel text-xl font-medium text-slate-700">
                        Just 4 simple steps, you can start translating content
                        effortlessly, easy setup, intuitive process, and you're
                        ready for instant translation with no hassle
                    </p>
                </div>

                <article className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:gap-5 lg:p-0 xl:grid-cols-[481px_324px_471px]">
                    <div className="flex flex-col justify-between gap-8 rounded-[50px] border border-white p-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-96 lg:p-8">
                        <div className="flex items-center gap-4">
                            <div className="h-[32px] w-[32px] shrink-0 rounded-full bg-white"></div>
                            <span className="text-2xl font-medium">
                                [ Step 1 ]
                            </span>
                        </div>
                        <div>
                            <span className="mb-[10px] inline-block max-w-[140px] text-2xl font-semibold text-white">
                                Get Set Up in Seconds
                            </span>
                            <p className="max-w-[256px] text-xl text-slate-700">
                                Install the extension from your browser’s web
                                store
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-8 rounded-[50px] border border-white p-6 lg:col-span-2 lg:col-start-2 lg:row-start-1 lg:h-80 lg:p-8">
                        <div className="flex items-center gap-4">
                            <div className="h-[32px] w-[32px] shrink-0 rounded-full bg-white"></div>
                            <span className="text-2xl font-medium">
                                [ Step 2 ]
                            </span>
                        </div>

                        <div>
                            <div className="mb-5 flex flex-wrap gap-2">
                                <div className="inline-flex items-center gap-[6px] rounded-[40px] bg-white px-[16.5px] py-[10.5px]">
                                    <img
                                        src={SpainIcon}
                                        alt="Spain"
                                        className="w-[18px] shrink-0"
                                    />
                                    <span className="leading-none text-slate-700">
                                        ES
                                    </span>
                                </div>
                                <img src={Line} alt="Line" />
                                <div className="inline-flex items-center gap-[6px] rounded-[40px] bg-white px-[16.5px] py-[10.5px]">
                                    <img
                                        src={USAIcon}
                                        alt="USA"
                                        className="w-[18px] shrink-0"
                                    />
                                    <span className="leading-none text-slate-700">
                                        EN
                                    </span>
                                </div>
                                <img src={Line} alt="Line" />
                                <div className="inline-flex items-center gap-[6px] rounded-[40px] bg-white px-[16.5px] py-[10.5px]">
                                    <img
                                        src={DeutschlandIcon}
                                        alt="Deutschland"
                                        className="w-[18px] shrink-0"
                                    />
                                    <span className="leading-none text-slate-700">
                                        DE
                                    </span>
                                </div>
                                <img src={Line} alt="Line" />
                                <div className="inline-flex items-center gap-[6px] rounded-[40px] bg-white px-[16.5px] py-[10.5px]">
                                    <img
                                        src={FranceIcon}
                                        alt="France"
                                        className="w-[18px] shrink-0"
                                    />
                                    <span className="leading-none text-slate-700">
                                        FR
                                    </span>
                                </div>
                            </div>

                            <p className="max-w-[337px] text-xl text-slate-700">
                                Choose your preferred language for translation
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-8 rounded-[50px] border border-white bg-white p-6 lg:col-start-1 lg:row-start-3 lg:h-72 lg:p-8">
                        <div className="flex items-center gap-4">
                            <div className="h-[32px] w-[32px] shrink-0 rounded-full bg-dark"></div>
                            <span className="text-2xl font-medium text-dark">
                                [ Step 3 ]
                            </span>
                        </div>

                        <div>
                            <span className="mb-[10px] inline-block max-w-[257px] text-2xl font-semibold text-dark">
                                Experience Seamless Translation
                            </span>
                            <p className="max-w-[351px] text-xl text-slate-700">
                                Start browsing play a video, and watch as it’s
                                translated in real-time
                            </p>
                        </div>
                    </div>

                    <div className="lg:h-90 flex flex-col justify-between gap-8 rounded-[50px] border border-white p-6 lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:p-8">
                        <div className="flex items-center gap-4">
                            <div className="h-[32px] w-[32px] shrink-0 rounded-full bg-white"></div>
                            <span className="text-2xl font-medium">
                                [ Step 4 ]
                            </span>
                        </div>
                        <div>
                            <span className="mb-[10px] inline-block max-w-[227px] text-2xl font-semibold text-white">
                                Make It Truly Yours
                            </span>
                            <p className="max-w-[227px] text-xl text-slate-700">
                                Customize settings to fit your needs, whether
                                for professional, casual, or academic use
                            </p>
                        </div>
                    </div>

                    <div className="lg:h-90 relative overflow-hidden rounded-[50px] border border-white p-6 lg:col-start-3 lg:row-span-2 lg:row-start-2 lg:p-8">
                        <span className="relative z-10 inline-block max-w-[217px] text-3xl text-white">
                            Step-by-Step Process{" "}
                        </span>
                        <img
                            src={Noodle}
                            className="absolute bottom-0 right-0"
                            alt="Noodle"
                        />
                    </div>
                </article>
            </div>
        </section>
    );
};
