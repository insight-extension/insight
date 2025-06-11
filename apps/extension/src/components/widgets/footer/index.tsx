import { cn } from "@repo/ui/lib";

import { PageValues, pages } from "@/constants/pages";

interface FooterProps {
  currentPage: PageValues;
  setCurrentPage: (page: PageValues) => void;
}
export const Footer = (props: FooterProps) => {
  const { currentPage, setCurrentPage } = props;

  return (
    <div className="flex justify-center items-center pt-2 pb-1">
      <div className="w-fit flex justify-center items-center dark:bg-dark-100 bg-white rounded-full p-1">
        {pages.map((page) => (
          <button
            key={page.value}
            className={cn(
              "w-[42px] h-[42px] bg-transparent rounded-full flex justify-center items-center",
              page.value === currentPage &&
                "bg-gradient-to-r from-blue-400 dark:from-blue-500 dark:to-blue-200 to-green-300"
            )}
            onClick={() => setCurrentPage(page.value)}
          >
            <page.icon
              className={cn(
                "w-5 h-5 text-white-200 dark:text-white-100",
                page.value === currentPage && "text-white dark:text-dark-100"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
