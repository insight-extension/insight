import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { NAV_LINKS } from "../configs/route";
import { cn } from "@/lib";
import { Button } from "./Button";
import GlobalIcon from "../assets/icons/Global.svg";
import { WalletMultiButton } from "./wallet";
import { HeaderProps } from "./Header";
import { DepositModal } from "./modals";
import { DialogTrigger } from "./ui";
import { useWallet } from "@solana/wallet-adapter-react";

interface MobileHeaderProps extends HeaderProps {}

export const MobileHeader: FC<MobileHeaderProps> = () => {
    const { connected } = useWallet();

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [showModal]);

    const modalVariants = {
        hidden: {
            y: "-100vh",
        },
        visible: {
            y: 0,
            transition: {
                type: "tween", // Set transition type to 'tween'
                duration: 0.3, // Specify duration
            },
        },
        exit: {
            y: "-100vh",
            transition: {
                type: "tween",
                duration: 0.3,
                delay: 0.3,
            },
        },
    };

    const linkItemVariants = {
        hidden: { opacity: 0, y: "50%" },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut", // Add ease-out easing function
            },
        },
        exit: {
            opacity: 0,
            y: "50%",
            transition: {
                duration: 0.1,
                ease: "easeOut", // Add ease-out easing function
            },
        },
    };

    const navLinksVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
        exit: {
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    return (
        <nav className="">
            <div
                className="container mx-auto mt-6 flex items-center justify-between"
                onClick={toggleModal}
            >
                <Logo />
                <div
                    id="nav-icon1"
                    className={cn({
                        open: showModal,
                        "fixed right-4 top-1 z-50": showModal,
                    })}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-dark"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="relative w-full bg-dark"
                            variants={navLinksVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="mb-32 flex h-full flex-col items-center justify-center gap-8">
                                {NAV_LINKS.map((link, index) => (
                                    <motion.span
                                        key={index}
                                        className="cursor-pointer text-2xl font-light text-white"
                                        variants={linkItemVariants}
                                    >
                                        {link.title}
                                    </motion.span>
                                ))}
                            </div>

                            {connected && (
                                <DepositModal
                                    trigger={
                                        <DialogTrigger className="button-white wallet-adapter-dropdown-list-item mx-auto my-10 w-fit bg-purple-300">
                                            Deposit
                                        </DialogTrigger>
                                    }
                                />
                            )}

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <div className="flex flex-wrap justify-center gap-1">
                                    <Button variant="button-white">
                                        Download Now
                                    </Button>

                                    <WalletMultiButton className="button button-dark-border" />
                                </div>

                                <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-white">
                                    <img
                                        src={GlobalIcon}
                                        alt="GlobalIcon"
                                        className="h-[22px] w-[22px]"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default MobileHeader;
