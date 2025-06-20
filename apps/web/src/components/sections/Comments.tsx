import StarIcon from "@/assets/icons/star-purple.svg";
import Aleg from "@/assets/images/Aleg.png";
import Anna from "@/assets/images/Anna.png";
import { Button } from "@/components";

export const Comments = () => {
  return (
    <section className="mt-[140px]">
      <div className="container flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div className="text-center md:text-left">
          <h4 className="font-sofiaPro relative mb-5 max-w-[680px] text-2xl font-medium uppercase leading-tight text-white md:text-[56px]">
            break{" "}
            <span className="font-normal italic text-green-300">
              language barriers
            </span>{" "}
            eFFortlessly!
          </h4>
          <Button
            disabled
            variant="button-white"
            className="font-fixel px-[55px] py-[16px] md:text-[30px]"
          >
            Get Started
          </Button>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative h-[286px] w-[300px] bg-[url(/src/assets/icons/Union.svg)] bg-no-repeat">
            <div className="pr-8 pt-8 text-right">
              <span className="font-fixel mb-5 items-center justify-end gap-1 rounded-[60px] border border-purple-300 px-[14px] py-[6px] text-[13px] font-normal leading-none text-purple-300 md:inline-flex">
                4.9
                <img
                  src={StarIcon}
                  className="inline-block h-[13px] w-[13px] text-purple-300"
                />
              </span>
            </div>
            <p className="text-dark px-7 text-xl font-normal">
              Perfect for my studies! I can access foreign content effortlessly.
              A must-have for learning.
            </p>

            <div className="absolute -bottom-1 left-2 flex items-center gap-[10px]">
              <img src={Anna} className="h-[40px] w-[40px]" alt="" />
              <div>
                <div className="font-fixel text-white">Anna</div>
                <div className="font-fixel text-slate-700">Student</div>
              </div>
            </div>
          </div>
          <div className="relative h-[286px] w-[300px] bg-[url(/src/assets/icons/Union.svg)] bg-no-repeat">
            <div className="pr-8 pt-8 text-right">
              <span className="font-fixel mb-5 items-center justify-end gap-1 rounded-[60px] border border-purple-300 px-[14px] py-[6px] text-[13px] font-normal leading-none text-purple-300 md:inline-flex">
                4.8
                <img
                  src={StarIcon}
                  className="inline-block h-[13px] w-[13px] text-purple-300"
                />
              </span>
            </div>
            <p className="text-dark px-7 text-xl font-normal">
              Amazing tool! Real-time translations make browsing in any language
              easy. Highly recommend!
            </p>

            <div className="absolute -bottom-1 left-2 flex items-center gap-[10px]">
              <img src={Aleg} className="h-[40px] w-[40px]" alt="" />
              <div>
                <div className="font-fixel text-white">Oleg Thak</div>
                <div className="font-fixel text-slate-700">Freelancer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
