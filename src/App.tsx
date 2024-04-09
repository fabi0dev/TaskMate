import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store";
import Routers from "./routers";
import { ChakraProvider } from "@chakra-ui/react";
import { themeChakraUI } from "./theme/chakraUI";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={themeChakraUI}>
          <Routers />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
