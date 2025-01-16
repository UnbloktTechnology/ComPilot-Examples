from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.create_session_body_additional_information_wallet import CreateSessionBodyAdditionalInformationWallet


T = TypeVar("T", bound="CreateSessionBodyAdditionalInformation")


@_attrs_define
class CreateSessionBodyAdditionalInformation:
    """
    Attributes:
        email (Union[Unset, str]):
        phone (Union[Unset, str]):
        wallet (Union[Unset, CreateSessionBodyAdditionalInformationWallet]):
    """

    email: Union[Unset, str] = UNSET
    phone: Union[Unset, str] = UNSET
    wallet: Union[Unset, "CreateSessionBodyAdditionalInformationWallet"] = UNSET
    additional_properties: Dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        email = self.email

        phone = self.phone

        wallet: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.wallet, Unset):
            wallet = self.wallet.to_dict()

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if email is not UNSET:
            field_dict["email"] = email
        if phone is not UNSET:
            field_dict["phone"] = phone
        if wallet is not UNSET:
            field_dict["wallet"] = wallet

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.create_session_body_additional_information_wallet import (
            CreateSessionBodyAdditionalInformationWallet,
        )

        d = src_dict.copy()
        email = d.pop("email", UNSET)

        phone = d.pop("phone", UNSET)

        _wallet = d.pop("wallet", UNSET)
        wallet: Union[Unset, CreateSessionBodyAdditionalInformationWallet]
        if isinstance(_wallet, Unset):
            wallet = UNSET
        else:
            wallet = CreateSessionBodyAdditionalInformationWallet.from_dict(_wallet)

        create_session_body_additional_information = cls(
            email=email,
            phone=phone,
            wallet=wallet,
        )

        create_session_body_additional_information.additional_properties = d
        return create_session_body_additional_information

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
