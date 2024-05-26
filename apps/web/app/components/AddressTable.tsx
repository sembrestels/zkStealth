import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react';
import { Balance } from './Balance';

interface AddressTableProps {
  addresses: { nonce: bigint; stealthSafeAddress: string; privateKey: string; zkAddress: string; }[];
}

const AddressTable: React.FC<AddressTableProps> = ({ addresses }) => {
  return (
    <>
      <TableContainer>
        <Table variant='striped' colorScheme='teal' bg="rgba(255, 255, 255, 0.85)">
          <Thead>
            <Tr>
              <Th>Nonce</Th>
              <Th>Stealth Safe Address</Th>
              <Th>Signer Private Key</Th>
              <Th>ETH Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {addresses.map(({ nonce, stealthSafeAddress, privateKey, zkAddress }) => (
              <Tr key={nonce.toString()}>
                <Td>{nonce.toString()}</Td>
                <Td fontFamily="monospace">{stealthSafeAddress}</Td>
                <Td fontFamily="monospace">{privateKey.slice(0, 10)}...{privateKey.slice(-4)}</Td>
                <Td><Balance address={stealthSafeAddress as `0x${string}`} privateKey={privateKey as `0x${string}`} zkAddress={zkAddress as `0x${string}`} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export { AddressTable };

