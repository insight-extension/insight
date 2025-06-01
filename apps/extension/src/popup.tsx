import { useInitGTAG } from "@/hooks";
import { Home } from "@/new-ui/home";
import { Provider as ChakraProvider } from "@/new-ui/ui/provider";

import { App } from "./app";

// const IndexPopup = () => {
//   useInitGTAG("popup");

//   return <App isSidebar={false} width="popup" />;
// };

const IndexPopup = () => {
  useInitGTAG("popup");

  return (
    <ChakraProvider>
      {/* <App isSidebar={false} width="popup" /> */}
      <Home />
    </ChakraProvider>
    // <ChakraProvider>
    //   <Home />
    // </ChakraProvider>
  );
};

export default IndexPopup;
