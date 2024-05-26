import type { Metadata } from "next";
import { Box, CSSReset, ChakraProvider, Flex } from "@chakra-ui/react";
import WagmiConfig from "./components/WagmiConfig";
import Header from "./components/Header";
import {theme} from "./theme";

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
      <body style={{ background: "white url('/bg.png') no-repeat center center fixed", backgroundSize: "20%" }}>
        <ChakraProvider theme={theme}>
          <CSSReset />
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
