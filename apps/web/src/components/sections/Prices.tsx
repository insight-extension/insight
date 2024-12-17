import { cn } from "@/lib";
import { Button } from "@/components";

import StarIcon from "@/assets/icons/star.svg";
import Spring from "@/assets/images/spring.webp";

const Plans = [
    {
        id: 123,
        title: "TRIAL PERIOD",
        type: "Free",
        price: "$0.00",
        period: "3 hours/week",
        description:
            "Enjoy essential translation features with access to core languages at no cost.",
        buttonLink: "",
    },
    {
        id: 23,
        title: "most popular",
        type: "Individual",
        price: "$0.03",
        period: "/minute",
        description:
            "Perfect for those who need quick, short-term access to our features",
        buttonLink: "",
    },
    {
        id: 43,
        title: "most affordable",
        type: "Special",
        price: "$1.20",
        period: "/hour",
        description:
            "Ideal for regular users looking for more consistent service",
        buttonLink: "",
    },
];

export const Prices = () => {
    return (
        <>
            <section className="relative mt-9" id="pricing">
                <img
                    src={Spring}
                    alt="Spring"
                    className="absolute -left-[300px] top-0 -z-40 h-auto w-[1111px]"
                />
                <div className="container">
                    <div className="relative mb-[121px] text-center">
                        <h4 className="relative mx-auto mb-8 max-w-[870px] text-center font-sofiaPro text-2xl font-medium uppercase leading-tight text-white md:text-[76px]">
                            BE{" "}
                            <span className="font-normal italic text-green-300">
                                Connected with
                            </span>{" "}
                            Instant Translations
                            <span className="absolute -right-16 -top-12 hidden items-center gap-1 rounded-[60px] border border-white px-[25px] py-[12px] font-fixel text-2xl font-normal leading-none md:inline-flex">
                                4.8
                                <img
                                    src={StarIcon}
                                    className="inline-block h-[23px] w-[23px]"
                                />
                            </span>
                        </h4>
                        <Button
                            variant="button-white"
                            className="px-[55px] py-[16px] font-fixel md:text-[30px]"
                        >
                            Download For Chrome
                        </Button>
                    </div>

                    <p className="mb-[121px] ml-auto max-w-[250px] text-xl font-medium text-slate-700">
                        Get started in seconds with a quick installation
                    </p>

                    <div className="flex max-w-[1231px] flex-wrap justify-between gap-5 lg:flex-nowrap">
                        {Plans.map((item, index) => (
                            <article
                                key={item.id}
                                className={cn(
                                    "w-full rounded-[50px] border border-white bg-dark px-6 pb-[74px] pt-[65px] text-center text-white lg:px-[50px]",
                                    {
                                        "-order-1 bg-[#B8FFE5] text-dark lg:-order-none":
                                            index === 1,
                                    }
                                )}
                            >
                                <span
                                    className={cn(
                                        "mb-[30px] inline-block rounded-[25px] border-[0.5px] border-white bg-transparent px-[17px] py-[7px] font-poppins font-light uppercase leading-none",
                                        {
                                            "border-[0.5px] border-dark text-dark":
                                                index === 1,
                                        }
                                    )}
                                >
                                    {item.title}
                                </span>
                                <span className="mb-[34px] block font-poppins text-2xl font-medium leading-none">
                                    {item.type}
                                </span>
                                <div className="mb-1 font-poppins text-4xl font-medium leading-none md:text-[70px]">
                                    {item.price}
                                </div>
                                <span
                                    className={cn(
                                        "mb-[18px] inline-block font-poppins font-light leading-none text-slate-700 md:text-[20px]",
                                        {
                                            "text-[#3D3D3D]": index === 1,
                                        }
                                    )}
                                >
                                    {item.period}
                                </span>
                                <p
                                    className={cn(
                                        "mx-auto mb-[25px] block text-center font-poppins font-light text-slate-700 md:text-[20px]",
                                        {
                                            "text-[#3D3D3D]": index === 1,
                                            "lg:max-w-[280px]": index === 2,
                                        }
                                    )}
                                >
                                    {item.description}
                                </p>
                                <Button
                                    variant={
                                        index === 1
                                            ? "button-dark"
                                            : "button-white"
                                    }
                                    className="py-[13px] font-poppins text-xl md:px-[50px] md:text-[27px]"
                                >
                                    Get Started
                                </Button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
