import { Flex, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
    return (
        <Flex
            justify="space-between"
            align="center"
            p="1rem"
            boxShadow="md"
            bg="primary.500"
        >
            <Text color="white" mr="1rem" fontSize="2xl" fontWeight="bold">
                zkStealth
            </Text>
            <ConnectButton />
        </Flex>
    );
}