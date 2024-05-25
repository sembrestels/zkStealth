import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Box, CSSReset, ChakraProvider, Flex } from "@chakra-ui/react";
import WagmiConfig from "./components/WagmiConfig";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });
const theme = {
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
};

export const metadata: Metadata = {
  title: "zkStealth",
  description: "zkStealth combines zkBob with stealth addresses",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider theme={theme}>
          
          <WagmiConfig>
          <Header />
                  <Box maxW="1280px" m="0 auto" p="2rem" textAlign="center">
                    <Flex justifyContent={"center"} my="4">
                      {children}
                    </Flex>
                  </Box>
          </WagmiConfig>
        </ChakraProvider>
      </body>
    </html>
  );
}
