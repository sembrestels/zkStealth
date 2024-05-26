"use client";

import { Inter } from "next/font/google";
import { extendTheme } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });
const theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  colors: {
    primary: {
      100: "#f0f0f0",
      200: "#e0e0e0",
      300: "#d0d0d0",
      400: "#c0c0c0",
      500: "#5bbad5",
      600: "#408090",
      700: "#307080",
      800: "#206070",
      900: "#105060",
    },
  },
});

export { theme };
