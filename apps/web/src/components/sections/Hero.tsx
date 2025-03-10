import ChromeIcon from "@/assets/icons/ChromeIcon.svg";
import PlayBtnIcon from "@/assets/icons/PlayBtn.svg";
import People1 from "@/assets/images/people-1.png";
import People2 from "@/assets/images/people-2.png";
import People3 from "@/assets/images/people-3.png";
import People4 from "@/assets/images/people-4.png";
import Spring from "@/assets/images/spring.webp";
import Girl from "@/assets/images/video.png";
import { Button, DownloadModal, LinesWaveAnimation } from "@/components";

export const Hero = () => {
  return (
    <main className="relative mb-32 mt-28 px-2">
      <img
        src={Spring}
        alt="Spring"
        className="absolute -right-[300px] top-1/2 -z-40 hidden max-w-[1111px] md:block"
      />
      <h1 className="font-sofiaPro mx-auto mb-5 max-w-[986px] text-center text-[40px] leading-tight text-white md:text-[76px]">
        Break Language Barriers with{" "}
        <span className="italic">Real-Time Translation!</span>
      </h1>
      <p className="mx-auto mb-7 max-w-[400px] text-center text-xl text-slate-700">
        Effortlessly{" "}
        <span className="text-green-300">break language barriers</span> while
        browsing — fast, intuitive, and secure
      </p>

      <div className="flex flex-col items-center justify-center gap-7 lg:flex-row">
        <div className="relative h-[368px] w-full max-w-[341px] overflow-hidden rounded-[50px] bg-white px-6 pb-[35px] pt-6">
          <span className="text-dark mb-1 inline-block rounded-[26px] bg-slate-600 px-7 py-2 leading-none">
            CAGR
          </span>
          <span className="font-poppins text-dark text-[70px] font-medium">
            87.2%
          </span>
          <p className="font-poppins mb-6 max-w-[208px] text-xl text-slate-700">
            expected to reach <span className="text-purple-300">$6.4</span>{" "}
            million by 2028
          </p>
          {/* <img
                        src={LinesIco}
                        alt="Lines"
                        className="absolute bottom-6 left-6"
                    /> */}
          <LinesWaveAnimation className="absolute bottom-6 left-6" />
        </div>

        <div className="-order-1 w-full max-w-[482px] rounded-[50px] bg-white px-6 py-12 text-center md:px-[78px] lg:-order-none">
          <span className="text-dark mx-auto mb-5 block text-[30px] font-semibold">
            Extension Usage
          </span>
          <p className="font-poppins mx-auto mb-6 text-center text-xl text-slate-700">
            Over <span className="text-purple-300">100 thousand users</span>{" "}
            utilize browser extensions monthly
          </p>
          <ul className="mb-6 flex justify-between">
            <li className="h-[60px] w-[60px] shrink-0 rounded-full">
              <img src={People1} alt="1" />
            </li>
            <li className="h-[60px] w-[60px] shrink-0 rounded-full">
              <img src={People2} alt="2" />
            </li>
            <li className="h-[60px] w-[60px] shrink-0 rounded-full">
              <img src={People3} alt="3" />
            </li>
            <li className="h-[60px] w-[60px] shrink-0 rounded-full">
              <img src={People4} alt="4" />
            </li>
          </ul>

          <DownloadModal
            trigger={
              <Button variant="button-dark" className="mb-5">
                Download Free
              </Button>
            }
            success={
              <Button variant="button-dark" className="mb-5" disabled>
                Extension is Installed!
              </Button>
            }
            withinSection
          />

          <span className="inline-flex items-center gap-3 text-base text-slate-700">
            Available For:{" "}
            <img
              src={ChromeIcon}
              className="h-[21px] w-[21px] shrink-0"
              alt=""
            />{" "}
          </span>
        </div>

        <div className="h-[368px] w-full max-w-[341px] rounded-[50px] bg-white px-6 pb-[35px] pt-6">
          <div className="group relative mb-4 transform overflow-hidden rounded-[30px]">
            <img
              src={Girl}
              className="max-h-[161] w-full transition-transform duration-500 ease-in-out group-hover:scale-105"
              alt="Video"
            />
            <img
              src={PlayBtnIcon}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ease-in-out group-hover:scale-110"
              alt=""
            />
          </div>
          <span className="text-dark mb-3 inline-block text-[30px] font-semibold leading-8">
            Real-time translation
          </span>
          <p className="text-xl text-slate-700">
            — watch and understand any language effortlessly
          </p>
        </div>
      </div>
    </main>
  );
};
