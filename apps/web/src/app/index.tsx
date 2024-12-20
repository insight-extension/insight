import { AppProvider } from "@/app/provider";
import { Home } from "@/app/routes/home";

// todo:
// use RTR: https://tanstack.com/router/v1/docs/framework/react/quick-start
// use KY
// use deno
// write e2e tests
// add sentry
// add posthog
// add auto connect wallet - open modal

// see: https://github.com/alan2207/bulletproof-react
// add docs
export const App = () => {
    return (
        <AppProvider>
            <Home />
        </AppProvider>
    );
};
