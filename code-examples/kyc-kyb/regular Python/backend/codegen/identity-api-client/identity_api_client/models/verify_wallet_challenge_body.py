from typing import Any, Dict, List, Type, TypeVar, Union, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.verify_wallet_challenge_body_blockchain_id_type_0 import VerifyWalletChallengeBodyBlockchainIdType0
from ..models.verify_wallet_challenge_body_blockchain_id_type_1 import VerifyWalletChallengeBodyBlockchainIdType1
from ..models.verify_wallet_challenge_body_blockchain_id_type_2 import VerifyWalletChallengeBodyBlockchainIdType2
from ..models.verify_wallet_challenge_body_blockchain_id_type_3 import VerifyWalletChallengeBodyBlockchainIdType3
from ..models.verify_wallet_challenge_body_namespace import VerifyWalletChallengeBodyNamespace
from ..types import UNSET, Unset

T = TypeVar("T", bound="VerifyWalletChallengeBody")


@_attrs_define
class VerifyWalletChallengeBody:
    """
    Attributes:
        message (str):
        signature (str):
        signer_public_key (str):
        signed_message (str):
        address (str):
        namespace (VerifyWalletChallengeBodyNamespace):
        signer_public_key_type (Union[Unset, str]):
        blockchain_id (Union[Unset, VerifyWalletChallengeBodyBlockchainIdType0,
            VerifyWalletChallengeBodyBlockchainIdType1, VerifyWalletChallengeBodyBlockchainIdType2,
            VerifyWalletChallengeBodyBlockchainIdType3]):
    """

    message: str
    signature: str
    signer_public_key: str
    signed_message: str
    address: str
    namespace: VerifyWalletChallengeBodyNamespace
    signer_public_key_type: Union[Unset, str] = UNSET
    blockchain_id: Union[
        Unset,
        VerifyWalletChallengeBodyBlockchainIdType0,
        VerifyWalletChallengeBodyBlockchainIdType1,
        VerifyWalletChallengeBodyBlockchainIdType2,
        VerifyWalletChallengeBodyBlockchainIdType3,
    ] = UNSET
    additional_properties: Dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        message = self.message

        signature: str
        signature = self.signature

        signer_public_key = self.signer_public_key

        signed_message = self.signed_message

        address: str
        address = self.address

        namespace = self.namespace.value

        signer_public_key_type = self.signer_public_key_type

        blockchain_id: Union[Unset, str]
        if isinstance(self.blockchain_id, Unset):
            blockchain_id = UNSET
        elif isinstance(self.blockchain_id, VerifyWalletChallengeBodyBlockchainIdType0):
            blockchain_id = self.blockchain_id.value
        elif isinstance(self.blockchain_id, VerifyWalletChallengeBodyBlockchainIdType1):
            blockchain_id = self.blockchain_id.value
        elif isinstance(self.blockchain_id, VerifyWalletChallengeBodyBlockchainIdType2):
            blockchain_id = self.blockchain_id.value
        else:
            blockchain_id = self.blockchain_id.value

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "message": message,
                "signature": signature,
                "signerPublicKey": signer_public_key,
                "signedMessage": signed_message,
                "address": address,
                "namespace": namespace,
            }
        )
        if signer_public_key_type is not UNSET:
            field_dict["signerPublicKeyType"] = signer_public_key_type
        if blockchain_id is not UNSET:
            field_dict["blockchainId"] = blockchain_id

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        d = src_dict.copy()
        message = d.pop("message")

        def _parse_signature(data: object) -> str:
            return cast(str, data)

        signature = _parse_signature(d.pop("signature"))

        signer_public_key = d.pop("signerPublicKey")

        signed_message = d.pop("signedMessage")

        def _parse_address(data: object) -> str:
            return cast(str, data)

        address = _parse_address(d.pop("address"))

        namespace = VerifyWalletChallengeBodyNamespace(d.pop("namespace"))

        signer_public_key_type = d.pop("signerPublicKeyType", UNSET)

        def _parse_blockchain_id(
            data: object,
        ) -> Union[
            Unset,
            VerifyWalletChallengeBodyBlockchainIdType0,
            VerifyWalletChallengeBodyBlockchainIdType1,
            VerifyWalletChallengeBodyBlockchainIdType2,
            VerifyWalletChallengeBodyBlockchainIdType3,
        ]:
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                blockchain_id_type_0 = VerifyWalletChallengeBodyBlockchainIdType0(data)

                return blockchain_id_type_0
            except:  # noqa: E722
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                blockchain_id_type_1 = VerifyWalletChallengeBodyBlockchainIdType1(data)

                return blockchain_id_type_1
            except:  # noqa: E722
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                blockchain_id_type_2 = VerifyWalletChallengeBodyBlockchainIdType2(data)

                return blockchain_id_type_2
            except:  # noqa: E722
                pass
            if not isinstance(data, str):
                raise TypeError()
            blockchain_id_type_3 = VerifyWalletChallengeBodyBlockchainIdType3(data)

            return blockchain_id_type_3

        blockchain_id = _parse_blockchain_id(d.pop("blockchainId", UNSET))

        verify_wallet_challenge_body = cls(
            message=message,
            signature=signature,
            signer_public_key=signer_public_key,
            signed_message=signed_message,
            address=address,
            namespace=namespace,
            signer_public_key_type=signer_public_key_type,
            blockchain_id=blockchain_id,
        )

        verify_wallet_challenge_body.additional_properties = d
        return verify_wallet_challenge_body

    @property
    def additional_keys(self) -> List[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
