import { App } from "@/app";
import { useGTM } from "@/hooks";

const SidePanel = () => {
  useGTM("/sidepanel");

  return <App isSidebar={true} width="sidebar" />;
};

export default SidePanel;
