import { App } from "@/app/";
import { useGTM } from "@/hooks";

const IndexPopup = () => {
  useGTM("/popup");

  return <App isSidebar={false} width="popup" />;
};

export default IndexPopup;
