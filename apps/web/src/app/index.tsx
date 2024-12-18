import { AppProvider } from "@/app/provider";
import { Home } from "@/app/routes/home";
import { AppErrorBoundary } from "@/app/boundary";
import { AppLoading } from "@/app/loading";

// todo:
// use RTR: https://tanstack.com/router/v1/docs/framework/react/quick-start
// use KY
// use deno
// write e2e tests
// add sentry
// add posthog
// add auto connect wallet - open modal
// add liter for imports: see plasmo

// architecture:
// see: https://github.com/alan2207/bulletproof-react
// add docs

export const App = () => {
    return (
        <AppProvider>
            <AppLoading>
                <AppErrorBoundary>
                    <Home />
                </AppErrorBoundary>
            </AppLoading>
        </AppProvider>
    );
};
