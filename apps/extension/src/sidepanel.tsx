import { App } from "@/app";
import { useInitGTAG } from "@/hooks";

const SidePanel = () => {
  useInitGTAG("sidepanel");

  return <App isSidebar={true} width="sidebar" />;
};

export default SidePanel;
