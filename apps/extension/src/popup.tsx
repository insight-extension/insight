import { App } from "@/app/";
import { useInitGTAG } from "@/hooks";

const IndexPopup = () => {
  useInitGTAG("/popup");

  return <App isSidebar={false} width="popup" />;
};

export default IndexPopup;
