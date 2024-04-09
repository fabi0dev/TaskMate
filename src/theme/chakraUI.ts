import { extendTheme } from "@chakra-ui/react";

export const themeChakraUI = extendTheme({
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
        secondary: {
          bg: "#00b0c7",
          fontWeight: "normal",
          _hover: {
            bg: "#00c2db",
          },
        },
        danger: {
          bg: "#c70d00",
          fontWeight: "normal",
          _hover: {
            bg: "#c71e00",
          },
        },
      },
    },
  },
});
