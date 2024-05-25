import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Switch, FormControl, FormLabel, SimpleGrid } from '@chakra-ui/react';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';

interface AddressTableProps {
  addresses: { nonce: bigint; stealthSafeAddress: string; }[];
}

const AddressTable: React.FC<AddressTableProps> = ({ addresses }) => {
  const [showZeroBalance, setShowZeroBalance] = useState(true);


  return (
    <>
      <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
        <FormLabel htmlFor='show-zero-balance'>Show all</FormLabel>
        <Switch
          id="show-zero-balance"
          isChecked={showZeroBalance}
          onChange={() => setShowZeroBalance(!showZeroBalance)}
        />
      </FormControl>
      <TableContainer>
        <Table variant='striped' colorScheme='teal'>
          <Thead>
            <Tr>
              <Th>Nonce</Th>
              <Th>Stealth Safe Address</Th>
              <Th>ETH Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {addresses.map(({ nonce, stealthSafeAddress }) => (
              <Tr key={nonce.toString()}>
                <Td>{nonce.toString()}</Td>
                <Td fontFamily="monospace">{stealthSafeAddress}</Td>
                <Td><Balance address={stealthSafeAddress as `0x${string}`} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AddressTable;


function Balance({ address }: { address: `0x${string}` }) {
    const balance = useBalance({ address })
  return <div>{formatUnits(balance.data?.value || 0n, 18)}</div>;
}

