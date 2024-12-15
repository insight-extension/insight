import SparePartsCars from "../../assets/images/Spare Parts Cars.png";

type FirstCardProps = {
    active: boolean;
};
export const SecondCard = ({ active }: FirstCardProps) => {
    return (
        <>
            <div>
                <div
                    className="w-[300px] rounded-[50px] bg-[#fff] p-[14px] md:min-h-[478px] md:w-[384px]"
                    style={{
                        background:
                            "linear-gradient(220deg, rgba(92,108,252,1) -70%, rgba(255,255,255,1) 100%)",
                    }}
                >
                    <div className="relative">
                        <img
                            src={SparePartsCars}
                            alt="ManEngagedVideoConference"
                            className="mb-5"
                            loading="lazy"
                        />
                    </div>
                    <div className="flex items-start justify-between pl-4">
                        <span className="inline-block max-w-[217px] text-lg font-medium text-dark md:text-3xl">
                            Customizable Preferences
                        </span>
                    </div>
                </div>
                {active && (
                    <div className="text-md mt-6 max-w-[280px] font-fixel text-white md:text-xl">
                        Fine-tune translations for dialect, industry-specific
                        terms, and more
                    </div>
                )}
            </div>
        </>
    );
};
