from enum import Enum


class VerifyWalletChallengeBodyBlockchainIdType0(str, Enum):
    VALUE_0 = "1"
    VALUE_1 = "137"
    VALUE_10 = "56"
    VALUE_11 = "97"
    VALUE_12 = "1284"
    VALUE_13 = "1285"
    VALUE_14 = "10"
    VALUE_15 = "11155420"
    VALUE_16 = "1291"
    VALUE_2 = "80002"
    VALUE_3 = "43114"
    VALUE_4 = "43113"
    VALUE_5 = "42161"
    VALUE_6 = "421614"
    VALUE_7 = "11155111"
    VALUE_8 = "8453"
    VALUE_9 = "84532"

    def __str__(self) -> str:
        return str(self.value)
