import { useState } from "react";
import SearchIcon from "react:@/assets/search-lg.svg";

import { SPLToken, TOKEN_CURRENCIES } from "@repo/shared/constants";
import { cn } from "@repo/ui/lib";

interface Transaction {
  id: number;
  comment: string;
  amount: number;
  fee: number;
  date: string;
  currency: string;
}

export const TransactionsPage = () => {
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };
  const formatAmount = (
    amount: number,
    includePlusSign: boolean = true,
    currency: string = TOKEN_CURRENCIES[SPLToken.USDC].symbol.toUpperCase()
  ): string => {
    const sign = amount < 0 || !includePlusSign ? "" : "+";
    return `${sign}${amount.toFixed(2)} ${currency}`;
  };

  return (
    <div className="flex flex-col gap-3 px-3 overflow-hidden">
      <div className="text-sm text-dark-200 font-medium dark:text-white-100">
        Transaction History
      </div>
      <div className="relative text-grey-600">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search"
          className=" py-2 text-xs pl-[22px] pr-1 w-full rounded-[20px] border dark:border-grey-500 border-grey-300 bg-transparent"
        />
        <SearchIcon className="absolute left-[8px] top-1/2 h-3 w-3 -translate-y-1/2" />
      </div>
      <div className="overflow-y-auto flex flex-col gap-2">
        {transactions.length === 0 && (
          <div className="text-sm text-dark-200 font-medium dark:text-white-100">
            No transactions found
          </div>
        )}
        {transactions
          .filter((transaction) =>
            transaction.comment.toLowerCase().includes(search.toLowerCase())
          )
          .map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between bg-grey-200 rounded-[17px] p-3 dark:bg-dark-300"
            >
              <div className="flex flex-col flex-1">
                <div className="text-dark-200 text-xs dark:text-white-100">
                  {transaction.comment}
                </div>
                <div className="text-dark-200/60 text-[10px] dark:text-white-100/80">
                  {formatDate(transaction.date)}
                </div>
              </div>
              <div className="flex flex-col flex-1 items-end">
                <div
                  className={cn(
                    "text-xs font-medium",
                    transaction.amount < 0 ? "text-red-400" : "text-green-400"
                  )}
                >
                  {formatAmount(transaction.amount)}
                </div>
                <div className="text-dark-200/60 text-[10px] dark:text-white-100/80">
                  Commision: {formatAmount(transaction.fee, false)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
