// import cssText from "data-text:~global.css";
// import type { PlasmoCSConfig } from "plasmo";

// export const config: PlasmoCSConfig = {
//   matches: ["<all_urls>"],
//   all_frames: true,
// };

// export const getStyle = () => {
//   const style = document.createElement("style");

//   style.textContent = cssText;

//   return style;
// };

// const PlasmoOverlay = () => {
//   return (
//     <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8"></div>
//   );
// };

// console.log(
//   "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
// );

// export default PlasmoOverlay;

// todo: add logic?
// see: https://docs.plasmo.com/framework/content-scripts-ui
const CustomButton = () => {
  return <button className="btn">Custom button</button>;
};

export default CustomButton;
