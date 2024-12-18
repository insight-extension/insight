import { lazy } from "react";
import { useIntl } from "react-intl";

import { useSetupAnchorProvider, useAuthentication } from "@/hooks";
import {
    ErrorAlert,
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
    const intl = useIntl();

    useSetupAnchorProvider();

    return (
        <>
            <Header className="hidden lg:flex" />
            <MobileHeader className="block lg:hidden" />

            {authenticationError && (
                <ErrorAlert
                    title={intl.formatMessage({ id: "error.authentication" })}
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
