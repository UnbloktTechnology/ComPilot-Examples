from enum import Enum


class CreateWalletChallengeResponse404Error(str, Enum):
    APP_NOT_FOUND_FOR_THE_GIVEN_WORKFLOWID = "App not found for the given workflowId"

    def __str__(self) -> str:
        return str(self.value)
