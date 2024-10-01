import Link from "next/link";

import { applicationLanguages } from "@repo/i18n";

interface LanguageSwitcherProps {
  currentLanguage: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
}) => {
  return (
    <details className="dropdown">
      <summary className="m-1 btn btn-xs btn-accent uppercase">
        {currentLanguage}
      </summary>

      <ul className="p-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-16 flex items-center">
        {applicationLanguages.map((applicationLanguage) => (
          <li key={applicationLanguage}>
            <Link
              className="m-1 btn btn-xs btn-secondary uppercase"
              href={`/${applicationLanguage}`}
            >
              {applicationLanguage}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};
