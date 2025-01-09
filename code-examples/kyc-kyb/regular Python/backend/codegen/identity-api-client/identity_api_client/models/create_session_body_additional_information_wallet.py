from typing import Any, Dict, List, Type, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.create_session_body_additional_information_wallet_namespace import (
    CreateSessionBodyAdditionalInformationWalletNamespace,
)

T = TypeVar("T", bound="CreateSessionBodyAdditionalInformationWallet")


@_attrs_define
class CreateSessionBodyAdditionalInformationWallet:
    """
    Attributes:
        address (str):
        namespace (CreateSessionBodyAdditionalInformationWalletNamespace):
    """

    address: str
    namespace: CreateSessionBodyAdditionalInformationWalletNamespace
    additional_properties: Dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        address: str
        address = self.address

        namespace = self.namespace.value

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "address": address,
                "namespace": namespace,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        d = src_dict.copy()

        def _parse_address(data: object) -> str:
            return cast(str, data)

        address = _parse_address(d.pop("address"))

        namespace = CreateSessionBodyAdditionalInformationWalletNamespace(d.pop("namespace"))

        create_session_body_additional_information_wallet = cls(
            address=address,
            namespace=namespace,
        )

        create_session_body_additional_information_wallet.additional_properties = d
        return create_session_body_additional_information_wallet

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
