from enum import Enum


class CreateWalletChallengeBodyBlockchainIdType1(str, Enum):
    NETXDQPRCVKPAWU = "NetXdQprcVkpaWU"
    NETXNHFVQM9IESP = "NetXnHfVqm9iesp"

    def __str__(self) -> str:
        return str(self.value)
