import { App } from "@/app/";

import { useGTM } from "./hooks";

const IndexPopup = () => {
  useGTM();

  return <App isSidebar={false} width="popup" />;
};

export default IndexPopup;
