import { 
    generateKeysFromSignature, 
    extractViewingPrivateKeyNode,
    generateEphemeralPrivateKey,
    generateStealthAddresses,
    predictStealthSafeAddressWithClient,
  } from '@fluidkey/stealth-account-kit'
  import { keccak256, toHex } from 'viem/utils';
  import { privateKeyToAccount } from 'viem/accounts';
  
  /**
   * End-to-end example of how to generate stealth Safe accounts based on the user's private key and the key generation message to be signed.
   *
   * @param signature
   * @param viewingPrivateKeyNodeNumber
   * @param nonce
   * @param chainId
   * @returns a list of objects containing the nonce and the corresponding stealth Safe address
   */
  
  export async function getStealthSafeAddress({
    signature,
    viewingPrivateKeyNodeNumber = 0,
    nonce = BigInt(0),
    chainId,
  }: {
    signature: `0x${string}`;
    viewingPrivateKeyNodeNumber?: number;
    nonce?: bigint;
    chainId: number;
  }): Promise<`0x${string}`> {
  
    // Generate the private keys from the signature
    const { spendingPrivateKey, viewingPrivateKey } = generateKeysFromSignature(signature);
  
    // Extract the node required to generate the pseudo-random input for stealth address generation
    const privateViewingKeyNode = extractViewingPrivateKeyNode(viewingPrivateKey, viewingPrivateKeyNodeNumber);
  
    // Get the spending public key
    const spendingAccount = privateKeyToAccount(spendingPrivateKey);
    const spendingPublicKey = spendingAccount.publicKey;
  
    // Generate the ephemeral private key
    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
    viewingPrivateKeyNode: privateViewingKeyNode,
    nonce,
    chainId,
    });

    // Generate the stealth owner address
    const { stealthAddresses } = generateStealthAddresses({
    spendingPublicKeys: [spendingPublicKey],
    ephemeralPrivateKey,
    });

    // Predict the corresponding stealth Safe address, both passing the client and using
    // the CREATE2 option with bytecode, making sure the addresses generated are the same
    console.log(`predicting Safe for signer ${stealthAddresses}`);
    const { stealthSafeAddress } = await predictStealthSafeAddressWithClient({
    threshold: 1,
    stealthAddresses,
    safeVersion: '1.3.0',
    useDefaultAddress: true,
    });

    return stealthSafeAddress
  }


  export const getMessageToSign = (params: {
    address: `0x${string}`;
    secret: string;
  }) => {
    const nonce = keccak256(toHex(params.address + params.secret)).replace(
      "0x",
      ""
    );
    const message = `Sign this message to generate your Fluidkey private payment keys.\n\nWARNING: Only sign this message within a trusted website or platform to avoid loss of funds.\n\nSecret: ${nonce}`;
  
    return message;
  };