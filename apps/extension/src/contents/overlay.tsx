import cssText from "data-text:@/global.css";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
};

export const getStyle = () => {
  const style = document.createElement("style");

  style.textContent = cssText;

  return style;
};

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8"></div>
  );
};

export default PlasmoOverlay;
