"""Contains all the data models used in inputs/outputs"""

from .create_session_body import CreateSessionBody
from .create_session_body_additional_information import CreateSessionBodyAdditionalInformation
from .create_session_body_additional_information_wallet import CreateSessionBodyAdditionalInformationWallet
from .create_session_body_additional_information_wallet_namespace import (
    CreateSessionBodyAdditionalInformationWalletNamespace,
)
from .create_session_response_200 import CreateSessionResponse200
from .create_session_response_404 import CreateSessionResponse404
from .create_wallet_challenge_body import CreateWalletChallengeBody
from .create_wallet_challenge_body_additional_information import CreateWalletChallengeBodyAdditionalInformation
from .create_wallet_challenge_body_additional_information_wallet import (
    CreateWalletChallengeBodyAdditionalInformationWallet,
)
from .create_wallet_challenge_body_additional_information_wallet_namespace import (
    CreateWalletChallengeBodyAdditionalInformationWalletNamespace,
)
from .create_wallet_challenge_body_blockchain_id_type_0 import CreateWalletChallengeBodyBlockchainIdType0
from .create_wallet_challenge_body_blockchain_id_type_1 import CreateWalletChallengeBodyBlockchainIdType1
from .create_wallet_challenge_body_blockchain_id_type_2 import CreateWalletChallengeBodyBlockchainIdType2
from .create_wallet_challenge_body_blockchain_id_type_3 import CreateWalletChallengeBodyBlockchainIdType3
from .create_wallet_challenge_body_namespace import CreateWalletChallengeBodyNamespace
from .create_wallet_challenge_response_200 import CreateWalletChallengeResponse200
from .create_wallet_challenge_response_404 import CreateWalletChallengeResponse404
from .create_wallet_challenge_response_404_error import CreateWalletChallengeResponse404Error
from .delete_data_by_key_response_200 import DeleteDataByKeyResponse200
from .save_data_body import SaveDataBody
from .save_data_response_200 import SaveDataResponse200
from .verify_wallet_challenge_body import VerifyWalletChallengeBody
from .verify_wallet_challenge_body_blockchain_id_type_0 import VerifyWalletChallengeBodyBlockchainIdType0
from .verify_wallet_challenge_body_blockchain_id_type_1 import VerifyWalletChallengeBodyBlockchainIdType1
from .verify_wallet_challenge_body_blockchain_id_type_2 import VerifyWalletChallengeBodyBlockchainIdType2
from .verify_wallet_challenge_body_blockchain_id_type_3 import VerifyWalletChallengeBodyBlockchainIdType3
from .verify_wallet_challenge_body_namespace import VerifyWalletChallengeBodyNamespace
from .verify_wallet_challenge_response_200 import VerifyWalletChallengeResponse200
from .verify_wallet_challenge_response_401 import VerifyWalletChallengeResponse401
from .verify_wallet_challenge_response_404 import VerifyWalletChallengeResponse404

__all__ = (
    "CreateSessionBody",
    "CreateSessionBodyAdditionalInformation",
    "CreateSessionBodyAdditionalInformationWallet",
    "CreateSessionBodyAdditionalInformationWalletNamespace",
    "CreateSessionResponse200",
    "CreateSessionResponse404",
    "CreateWalletChallengeBody",
    "CreateWalletChallengeBodyAdditionalInformation",
    "CreateWalletChallengeBodyAdditionalInformationWallet",
    "CreateWalletChallengeBodyAdditionalInformationWalletNamespace",
    "CreateWalletChallengeBodyBlockchainIdType0",
    "CreateWalletChallengeBodyBlockchainIdType1",
    "CreateWalletChallengeBodyBlockchainIdType2",
    "CreateWalletChallengeBodyBlockchainIdType3",
    "CreateWalletChallengeBodyNamespace",
    "CreateWalletChallengeResponse200",
    "CreateWalletChallengeResponse404",
    "CreateWalletChallengeResponse404Error",
    "DeleteDataByKeyResponse200",
    "SaveDataBody",
    "SaveDataResponse200",
    "VerifyWalletChallengeBody",
    "VerifyWalletChallengeBodyBlockchainIdType0",
    "VerifyWalletChallengeBodyBlockchainIdType1",
    "VerifyWalletChallengeBodyBlockchainIdType2",
    "VerifyWalletChallengeBodyBlockchainIdType3",
    "VerifyWalletChallengeBodyNamespace",
    "VerifyWalletChallengeResponse200",
    "VerifyWalletChallengeResponse401",
    "VerifyWalletChallengeResponse404",
)
