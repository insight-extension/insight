import { lazy, Suspense } from "react";

import { Hero } from "./components/sections/Hero";
import { HowItWorks } from "./components/sections/HowItWorks";
import { WhyOur } from "./components/sections/WhyOur";
import { Web3Community } from "./components/sections/We3Community";
import { Prices } from "./components/sections/Prices";
import { Faqs } from "./components/sections/Faqs";
import { Comments } from "./components/sections/Comments";
import { Footer } from "./components/sections/Footer";

import { useSetupAnchorProvider, useAuthentication } from "@/hooks";
import { AuthenticationAlert, Loader } from "./components";

const Header = lazy(() => import("./components/Header"));
const MobileHeader = lazy(() => import("./components/MobileHeader"));

// todo:
// use RTR: https://tanstack.com/router/v1/docs/framework/react/quick-start
// use KY
// use deno
// write e2e tests
// add sentry
// add posthog
// add auto connect wallet - open modal

const App = () => {
    const { authenticationError } = useAuthentication();

    useSetupAnchorProvider();

    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-screen items-center justify-center">
                    <Loader />
                </div>
            }
        >
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
        </Suspense>
    );
};

export default App;
