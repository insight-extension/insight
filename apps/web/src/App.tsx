import { lazy, Suspense } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

import { Hero } from "./components/sections/Hero";
import { HowItWorks } from "./components/sections/HowItWorks";
import { WhyOur } from "./components/sections/WhyOur";
import { Web3Community } from "./components/sections/We3Community";
import { Prices } from "./components/sections/Prices";
import { Faqs } from "./components/sections/Faqs";
import { Comments } from "./components/sections/Comments";
import { Footer } from "./components/sections/Footer";

import { useAnchorProvider, useAuthentication } from "@/hooks";
import { AuthenticationAlert } from "./components";
import { Loader } from "lucide-react";

const Header = lazy(() => import("./components/Header"));
const MobileHeader = lazy(() => import("./components/MobileHeader"));

// todo: use RTR: https://tanstack.com/router/v1/docs/framework/react/quick-start
// https://tanstack.com/router/latest/docs/framework/react/comparison

// todo: add auto connect wallet - open modal

const BREAKPOINT_WIDTH = 1023;

const App = () => {
    const { authenticationError } = useAuthentication();

    const { width } = useWindowSize();

    useAnchorProvider();

    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-screen items-center justify-center">
                    <Loader />
                </div>
            }
        >
            {width && width > BREAKPOINT_WIDTH ? <Header /> : <MobileHeader />}

            {authenticationError && (
                <AuthenticationAlert
                    title="Authentication Error"
                    message={authenticationError}
                />
            )}

            <Hero />
            <HowItWorks />
            <WhyOur />
            <Web3Community />
            <Prices />
            <Faqs />
            <Comments />
            <Footer />
        </Suspense>
    );
};

export default App;
