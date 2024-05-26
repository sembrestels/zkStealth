"use client"
import { useEffect, useState } from 'react';
import { getMessageToSign, getStealthSafeAddress } from "@repo/fluidkey-utils";
import { getMessageToSign as zkBobMessage, getZkBobClient } from "@repo/zkbob-utils";
import { useAccount, useSignMessage, usePublicClient } from 'wagmi';
import { PinInput, PinInputField, HStack, Heading, Text, Button } from '@chakra-ui/react';
import {AddressTable} from './components/AddressTable';

const loadMoreCount = 30; // Number of results to load each time

export default function Page(): JSX.Element {
  const [results, setResults] = useState<{ nonce: bigint; stealthSafeAddress: string; privateKey: string; zkAddress: string; }[]>([]);
  const [pin, setPin] = useState('');
  const [nonceCount, setNonceCount] = useState(loadMoreCount);
  const { signMessageAsync } = useSignMessage();
  const account = useAccount();
  const client = usePublicClient();
  const chainId = client?.chain?.id;

  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [zkBobClient, setZkBobClient] = useState<any>(null);

  useEffect(() => {
    async function fetchSignatureAndClient() {
      if (!account.isConnected || !account.address || !account.connector?.getProvider || pin.length !== 4) {
        return;
      }

      const message = getMessageToSign({
        address: account.address,
        secret: pin
      });

      const signature = await signMessageAsync({ message });
      const zkBobSignature = await signMessageAsync({ message: zkBobMessage() });
      const client = await getZkBobClient(zkBobSignature);

      setSignature(signature);
      setZkBobClient(client);
    }

    fetchSignatureAndClient();
  }, [signMessageAsync, account.address, account.isConnected, account.connector?.getProvider, pin]);

  useEffect(() => {
    async function fetchResults() {
      if (!signature || !zkBobClient || !account.isConnected || !account.address || !account.connector?.getProvider || pin.length !== 4) {
        return;
      }

      const newResults: { nonce: bigint; stealthSafeAddress: string; privateKey: string; zkAddress: string; }[] = [];
      for (let nonce = results.length; nonce < nonceCount; nonce++) {
        const [stealthSafeAddress, privateKey] = await getStealthSafeAddress({ signature, nonce: BigInt(nonce), chainId: 0 });
        const zkAddress = await zkBobClient.generateAddress();

        setResults(prevResults => [
          ...prevResults,
          {
            nonce: BigInt(nonce),
            stealthSafeAddress,
            privateKey,
            zkAddress
          }
        ]);
      }
    }

    fetchResults();
  }, [signature, zkBobClient, account.isConnected, account.address, account.connector?.getProvider, chainId, pin, nonceCount]);
  const loadMoreResults = () => {
    setNonceCount(prevCount => prevCount + loadMoreCount);
  };

  return (
    <main>
      <Heading size="lg" mb={8}>Hello Anon</Heading>
      {!account.isConnected ? (
        <p>Please connect your account to see your addresses.</p>
      ) : pin.length !== 4 ? (
        <>
          <Text>Enter your PIN</Text>
          <HStack>
            <PinInput value={pin} onChange={setPin} size="lg" autoFocus >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        </>
      ) : (
        results.length > 0 ? (
          <>
            <AddressTable addresses={results} />
            <Button onClick={loadMoreResults} mt={4}>Load More</Button>
          </>
        ) : (
          <p>Loading...</p>
        )
      )}
    </main>
  );
}
