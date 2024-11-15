from enum import Enum


class CreateWalletChallengeBodyBlockchainIdType3(str, Enum):
    VALUE_0 = "0x534e5f4d41494e"
    VALUE_1 = "0x534e5f5345504f4c4941"

    def __str__(self) -> str:
        return str(self.value)
