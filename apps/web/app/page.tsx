"use client"
import { useEffect, useState } from 'react';
import { getMessageToSign, getStealthSafeAddress } from "@repo/fluidkey-utils";
import { getMessageToSign as zkBobMessage, getZkBobClient } from "@repo/zkbob-utils";
import { useAccount, useSignMessage, usePublicClient } from 'wagmi';
import { PinInput, PinInputField, HStack, Heading, Text } from '@chakra-ui/react';
import {AddressTable} from './components/AddressTable';

const toNonce = 30;

export default function Page(): JSX.Element {
  const [results, setResults] = useState<{ nonce: bigint; stealthSafeAddress: string; privateKey: string; zkAddress: string; }[]>([]);
  const [pin, setPin] = useState('');
  const { signMessageAsync } = useSignMessage();
  const account = useAccount();
  const client = usePublicClient();
  const chainId = client?.chain?.id;

  useEffect(() => {
    async function fetchResults() {
      console.log('fetching', account.isConnected, account.address);
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
      for (let nonce = 0; nonce < toNonce; nonce++) {
        const [stealthSafeAddress, privateKey] = await getStealthSafeAddress({ signature, nonce: BigInt(nonce), chainId: 0 });
        const zkAddress = await client.generateAddress();

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
  }, [signMessageAsync, account.address, account.isConnected, account.connector?.getProvider, chainId, pin]);

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
            <AddressTable addresses={results} />
          ) : (
            <p>Loading...</p>
          )
      )}
    </main>
  );
}
