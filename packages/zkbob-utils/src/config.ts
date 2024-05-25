import { ClientConfig, DepositType } from 'zkbob-client-js';
import { v4 as uuidv4 } from 'uuid';

const clientConfig: ClientConfig = {
    pools: {
        "WETH-optimism": {
            "chainId": 10,
            "poolAddress": "0x58320A55bbc5F89E5D0c92108F762Ac0172C5992",
            "tokenAddress": "0x4200000000000000000000000000000000000006",
            "relayerUrls": ["https://relayer-eth-opt-mvp.zkbob.com/"],
            "delegatedProverUrls": [],
            "isNative": true,
            "minTxAmount": BigInt(0),
            "depositScheme": DepositType.PermitV2,
            "ddSubgraph": "zkbob-eth-optimism"
        }

    },
    chains: {
        "10": {
            "rpcUrls": ["https://rpc.ankr.com/optimism", "https://mainnet.optimism.io"]
        }
    },
    snarkParams: {
      "transferParamsUrl": "https://r2.zkbob.com/transfer_params_22022023.bin",
      "transferVkUrl": "https://r2.zkbob.com/transfer_verification_key_22022023.json"
    },
    supportId: uuidv4(),
};

export default clientConfig;
