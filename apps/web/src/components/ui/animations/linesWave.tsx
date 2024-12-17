import { motion } from "framer-motion";
import { cn } from "@/lib";

type LinesWaveAnimationProps = {
    className?: string;
};

export const LinesWaveAnimation = ({ className }: LinesWaveAnimationProps) => {
    const waveVariants = {
        initial: {
            pathLength: 0,
            pathOffset: 0,
        },
        animate: {
            pathLength: 1,
            pathOffset: 0,
            transition: {
                pathLength: {
                    duration: 4,
                    ease: "easeInOut",
                },
                pathOffset: {
                    duration: 8,
                    ease: "linear",
                },
            },
        },
    };

    const secondWaveVariants = {
        initial: {
            pathLength: 0,
            pathOffset: 0,
        },
        animate: {
            pathLength: 1,
            pathOffset: 0,
            transition: {
                pathLength: {
                    duration: 6,
                    ease: "easeInOut",
                },
                pathOffset: {
                    duration: 12,
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div className={cn(className)}>
            <svg
                width="301"
                height="197"
                viewBox="0 0 301 197"
                className="h-full w-full"
            >
                <motion.path
                    d="M1.00183 196C1.00183 189.497 0.673587 182.912 8.80179 182.759C15.9217 182.625 23.0577 182.759 30.1794 182.759C53.6412 182.759 46.2651 145.866 67.3737 144.433C74.4276 143.954 80.6701 144.481 87.4513 146.272C98.1036 149.085 105.439 144.249 112.512 136.709C117.471 131.424 121.411 122.091 129.701 121.849C137.879 121.611 139.993 131.938 143.279 138.327C148.659 148.79 159.547 154.846 168.845 143.918C176.66 134.733 180.264 121.856 184.878 110.889C189.817 99.152 194.594 87.1192 200.551 75.8731C202.73 71.7577 214.517 51.1507 220.7 61.8227C224.358 68.1347 227.432 82.9762 235 69.9145C242.996 56.1148 240.644 36.4394 250.745 23.8647C256.94 16.1525 265.514 7.26139 275.95 8.0488C286.572 8.85018 293.777 21.5548 300 29.1611"
                    stroke="#898989"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial="initial"
                    animate="animate"
                    variants={waveVariants}
                />
                <motion.path
                    d="M8 189.665C11.7782 189.665 18.3334 191.072 21.1694 188.119C22.5799 186.651 23.2354 185.337 24.0492 183.383C27.0144 176.265 28.8258 168.565 31.4267 161.315C35.4449 150.114 39.4862 138.095 46.1169 128.129C48.0055 125.291 49.8679 123.577 53.1708 123.361C57.1014 123.103 57.4106 127.805 58.0891 130.761C59.7041 137.796 60.2667 145.461 63.7193 151.908C73.335 169.865 96.0421 155.045 107.628 147.468C117.42 141.065 125.144 132.608 133.223 124.15C139.129 117.967 145.017 110.596 152.378 106.061C155.176 104.337 158.152 103.768 161.18 105.206C166.424 107.696 170.514 113.174 174.802 116.98C180.649 122.171 187.738 124.192 195.381 122.012C216.327 116.039 223.355 92.2593 226.865 72.9744C228.989 61.3043 230.216 49.4679 232.624 37.8489C233.917 31.6121 253.048 -37.1245 273 30.6661"
                    stroke="#57FFC1"
                    strokeWidth="2"
                    strokeOpacity="0.62"
                    fill="none"
                    strokeLinecap="round"
                    initial="initial"
                    animate="animate"
                    variants={secondWaveVariants}
                />
            </svg>
        </div>
    );
};
