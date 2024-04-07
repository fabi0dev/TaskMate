import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store";
import Routers from "./routers";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  components: {
    Modal: {
      baseStyle: () => ({
        dialog: {
          bg: "#1a1e27",
        },
      }),
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "#1a1e27",
          border: 0,
          boxShadow: "md",
        },
        item: {
          bg: "#1a1e27",
          _hover: {
            bg: "#15181f",
          },
        },
      },
    },

    Button: {
      variants: {
        primary: {
          bg: "#0bbe35",
          fontWeight: "normal",
          _hover: {
            bg: "#0bae2d",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <Routers />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
