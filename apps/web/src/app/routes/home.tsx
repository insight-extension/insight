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
import { useTranslation } from "react-i18next";

const Header = lazy(() => import("@/components/sections/Header"));
const MobileHeader = lazy(() => import("@/components/sections/MobileHeader"));

export const Home = () => {
    const { authenticationError } = useAuthentication();
    const { t } = useTranslation();

    useSetupAnchorProvider();

    return (
        <>
            <Header className="hidden lg:flex" />
            <MobileHeader className="block lg:hidden" />

            {authenticationError && (
                <AuthenticationAlert
                    title={t("alert.authentication.title")}
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
