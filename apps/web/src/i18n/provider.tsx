import { FC, PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";

import messages from "@/i18n/locales/en.json";

const locale = "en";

interface LocalizationProviderProps extends PropsWithChildren {}

export const LocalizationProvider: FC<LocalizationProviderProps> = ({
    children,
}) => {
    return (
        <IntlProvider locale={locale} messages={messages}>
            {children}
        </IntlProvider>
    );
};
