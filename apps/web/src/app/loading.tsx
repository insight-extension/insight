import { FC, PropsWithChildren, Suspense } from "react";

import { Loader } from "@/components";

interface AppLoadingProps extends PropsWithChildren {}

export const AppLoading: FC<AppLoadingProps> = ({ children }) => {
    return <Suspense fallback={<Loader withContainer />}>{children}</Suspense>;
};
