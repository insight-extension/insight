import { lazy } from "react";

import { useSetupAnchorProvider, useAuthentication } from "@/hooks";
import {
    AuthenticationAlert,
    Hero,
    HowItWorks,
    WhyOur,
    Web3Community,
    Prices,
    Faqs,
    Comments,
    Footer,
} from "@/components";

const Header = lazy(() => import("@/components/sections/Header"));
const MobileHeader = lazy(() => import("@/components/sections/MobileHeader"));

export const Home = () => {
    const { authenticationError } = useAuthentication();

    useSetupAnchorProvider();

    return (
        <>
            <Header className="hidden lg:flex" />
            <MobileHeader className="block lg:hidden" />

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
        </>
    );
};
