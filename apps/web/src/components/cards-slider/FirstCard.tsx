import ManEngagedVideoConference from "../../assets/images/ManEngagedVideoConference.webp";
import Radio from "../../assets/icons/radio.svg";
type FirstCardProps = {
    active: boolean;
};
export const FirstCard = ({ active }: FirstCardProps) => {
    return (
        <>
            <div>
                <div
                    className="w-[300px] rounded-[50px] bg-[#fff] p-[14px] md:min-h-[478px] md:w-[384px]"
                    style={{
                        background:
                            "linear-gradient(220deg, rgba(157,172,198,1) 0%, rgba(255,255,255,1) 100%)",
                    }}
                >
                    <div className="relative">
                        <img
                            src={ManEngagedVideoConference}
                            alt="ManEngagedVideoConference"
                            className="mb-5"
                        />
                        <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-nowrap rounded-[34px] bg-black/50 px-3 md:block">
                            who are already experiencing a world{" "}
                        </div>
                    </div>
                    <div className="flex items-start justify-between pl-4">
                        <span className="inline-block max-w-[217px] text-lg font-medium text-dark md:text-3xl">
                            Real-Time Translations
                        </span>
                        <span className="inline-flex items-center gap-[3px] rounded bg-[#BA000D] px-[5px] py-[4px] text-[10px] leading-none">
                            <img
                                src={Radio}
                                alt="radio"
                                className="max-w-[10px]"
                            />
                            LIVE
                        </span>
                    </div>
                </div>
                {active && (
                    <div className="text-md mt-6 max-w-[280px] font-fixel text-white md:text-xl">
                        Instant translation of web pages, audio, and video as
                        you browse
                    </div>
                )}
            </div>
        </>
    );
};
