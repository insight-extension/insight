import clsx from "clsx";

import { Button } from "~components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~components/ui/card";

import "~style.css";

import { Connection } from "~types";

function IndexPopup() {
  const { getMessage } = chrome.i18n;

  // todo: replace with real data
  const getBalance = () => 100;
  const getStatus = () => Connection.CONNECTED;

  return (
    <Card className="w-72">
      <CardHeader>HEADER</CardHeader>

      <CardContent className="p-2.5 bg-accent h-32 rounded-b-2xl">
        <div className="flex flex-row justify-between items-center mb-3">
          <Button variant="default">{getMessage("connectWallet")}</Button>

          <Button variant="default">{getMessage("depositFunds")}</Button>
        </div>

        <div className="flex flex-row mb-2 items-center h-8 bg-accent-foreground rounded">
          <p className="px-3 text-primary-foreground font-medium text-base">
            {`${getMessage("balance")}: ${getBalance()}`}
          </p>
        </div>

        <p className="px-3 text-primary-foreground font-medium text-base">
          {`${getMessage("status")}: `}
          <span
            className={
              getStatus() === Connection.CONNECTED
                ? "text-green-500"
                : getStatus() === Connection.CONNECTING
                  ? "text-yellow-500"
                  : "text-red-500"
            }>
            {getStatus()}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

export default IndexPopup;
