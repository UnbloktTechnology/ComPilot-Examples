from enum import Enum


class CreateSessionBodyAdditionalInformationWalletNamespace(str, Enum):
    APTOS = "aptos"
    CARDANO = "cardano"
    COSMOS = "cosmos"
    EIP155 = "eip155"
    POLKADOT = "polkadot"
    SOLANA = "solana"
    STARKNET = "starknet"
    TEZOS = "tezos"

    def __str__(self) -> str:
        return str(self.value)
