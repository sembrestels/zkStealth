import { encodeFunctionData, formatUnits, parseAbi, stringToHex } from "viem";
import { useBalance, useBytecode, useClient, useSendTransaction, useWalletClient } from "wagmi";
import { Button } from "@chakra-ui/react";
import { getBalance, waitForTransactionReceipt } from "viem/actions";
import { privateKeyToAccount } from "viem/accounts";

const hydratorContract = "0x1a93629BFcc6E9c7241E587094FAE26F62503FaD";
const depositContract = "0x318e2C1f5f6Ac4fDD5979E73D498342B255fC869";
const estimatedFee = 200000000000000n;

export function Balance({ address, privateKey, zkAddress }: { address: `0x${string}`, privateKey: `0x${string}`; zkAddress: `0x${string}` }) {
    const balance = useBalance({ address });
    const { data: bytecode } = useBytecode({ address });
    const { sendTransactionAsync } = useSendTransaction();
    const client = useClient();
    const {data: walletClient} = useWalletClient();
    const isContract = bytecode !== undefined && bytecode !== null;

    const handleClick = async () => {
        if (!client || !walletClient) {
            return;
        }

        const account = privateKeyToAccount(privateKey);

        if (!isContract) {
            // deploy contract
            const paddedAddr = `0x${account.address.slice(2).padEnd(64, "0")}` as `0x${string}`;
            const tx = await sendTransactionAsync({
                to: hydratorContract,
                value: 0n,
                data: encodeFunctionData({
                    abi: parseAbi(["function deploySafe(bytes32 signerAddress) external"]),
                    functionName: "deploySafe",
                    args: [paddedAddr],
                }),
            });
            await waitForTransactionReceipt(client, { hash: tx });
        }
        // encode the transaction data for directNativeDeposit
        const depositData = encodeFunctionData({
            abi: parseAbi(["function directNativeDeposit(address _fallbackUser,bytes _rawZkAddress) external"]),
            functionName: "directNativeDeposit",
            args: [address, stringToHex(zkAddress.split(":")[1] || "")],
        });

        // encode the Safe multisig transaction
        const safeTxData = encodeFunctionData({
            abi: parseAbi(["function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes memory signatures) external"]),
            functionName: "execTransaction",
            args: [
                depositContract, // to
                balance.data?.value ? balance.data.value : 0n, // value
                depositData, // data
                0, // operation (0 for call)
                0n, // safeTxGas
                0n, // baseGas
                0n, // gasPrice
                "0x0000000000000000000000000000000000000000", // gasToken
                "0x0000000000000000000000000000000000000000", // refundReceiver
                `0x000000000000000000000000${account.address.slice(2)}000000000000000000000000000000000000000000000000000000000000000001` // signatures
            ],
        });
        if (await getBalance(client, {address: account.address}) === 0n) {
            const injectedAccount = walletClient.account.address;
            const sendEthTx = await walletClient.sendTransaction({
                from: injectedAccount,
                to: account.address,
                value: estimatedFee,
            });
            await waitForTransactionReceipt(client, { hash: sendEthTx, confirmations: 1 });
        }

        const hash = await walletClient.sendTransaction({
            account,
            to: address,
            value: 0n,
            data: safeTxData
        });
        await waitForTransactionReceipt(client, { hash });
        window.open("https://app.zkbob.com", "_blank");
    };

    return (
        <Button onClick={handleClick} color={isContract ? "primary.700" : "black"}>
            {balance.data?.value ? <>Send {formatUnits(balance.data.value, 18)} ETH to zkBob</> : <>0 ETH</>}
        </Button>
    );
}
