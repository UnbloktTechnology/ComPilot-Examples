from enum import Enum


class CreateWalletChallengeBodyBlockchainIdType2(str, Enum):
    COSMOSHUB_4 = "cosmoshub-4"
    THETA_TESTNET_001 = "theta-testnet-001"

    def __str__(self) -> str:
        return str(self.value)
