import Social from "../../assets/images/Learning Language Flags Illustration.png";

type FirstCardProps = {
    active: boolean;
};
export const FifthCard = ({ active }: FirstCardProps) => {
    return (
        <>
            <div>
                <div
                    className="flex w-[300px] flex-col justify-between rounded-[50px] bg-[#fff] p-[14px] pb-6 md:min-h-[478px] md:w-[384px]"
                    style={{
                        background:
                            "linear-gradient(20deg, rgba(92,108,252,1) -70%, rgba(255,255,255,1) 100%)",
                    }}
                >
                    <div className="relative">
                        <img
                            src={Social}
                            alt=""
                            className="mb-5"
                            loading="lazy"
                        />
                    </div>
                    <div className="flex items-start justify-between pl-4">
                        <span className="inline-block max-w-[217px] text-lg font-medium text-white md:text-3xl">
                            Supports Multiple Languages
                        </span>
                    </div>
                </div>
                {active && (
                    <div className="text-md mt-6 max-w-[280px] font-fixel text-white md:text-xl">
                        Translate into 100+ languages with high accuracy
                    </div>
                )}
            </div>
        </>
    );
};
