"use client"
import { useEffect, useState } from 'react';
import { getMessageToSign, getStealthSafeAddress } from "@repo/fluidkey-utils";
import { useAccount, useSignMessage, usePublicClient } from 'wagmi';
import { PinInput, PinInputField, HStack } from '@chakra-ui/react';
import AddressTable from './components/AddressTable';

const toNonce = 30;

export default function Page(): JSX.Element {
  const [results, setResults] = useState<{ nonce: bigint; stealthSafeAddress: string; }[]>([]);
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
      for (let nonce = 0; nonce < toNonce; nonce++) {
        const stealthSafeAddress = await getStealthSafeAddress({ signature, nonce: BigInt(nonce), chainId: 0 });
        
        setResults(prevResults => [
          ...prevResults,
          {
            nonce: BigInt(nonce),
            stealthSafeAddress
          }
        ]);
      }
    }
    fetchResults();
  }, [signMessageAsync, account.address, account.isConnected, account.connector?.getProvider, chainId, pin]);

  return (
    <main>
      Hello Anon
      {!account.isConnected ? (
        <p>Please connect your account to see your addresses.</p>
      ) : (
        <>
          <HStack>
            <PinInput value={pin} onChange={setPin} size="lg" otp>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          {results.length > 0 ? (
            <AddressTable addresses={results} />
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </main>
  );
}
