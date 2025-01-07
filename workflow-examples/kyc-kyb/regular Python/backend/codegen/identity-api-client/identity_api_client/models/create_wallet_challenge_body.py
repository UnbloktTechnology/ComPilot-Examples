from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.create_wallet_challenge_body_blockchain_id_type_0 import CreateWalletChallengeBodyBlockchainIdType0
from ..models.create_wallet_challenge_body_blockchain_id_type_1 import CreateWalletChallengeBodyBlockchainIdType1
from ..models.create_wallet_challenge_body_blockchain_id_type_2 import CreateWalletChallengeBodyBlockchainIdType2
from ..models.create_wallet_challenge_body_blockchain_id_type_3 import CreateWalletChallengeBodyBlockchainIdType3
from ..models.create_wallet_challenge_body_namespace import CreateWalletChallengeBodyNamespace
from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.create_wallet_challenge_body_additional_information import (
        CreateWalletChallengeBodyAdditionalInformation,
    )


T = TypeVar("T", bound="CreateWalletChallengeBody")


@_attrs_define
class CreateWalletChallengeBody:
    """
    Attributes:
        address (str):
        namespace (CreateWalletChallengeBodyNamespace):
        origin (str):
        workflow_id (str):
        blockchain_id (Union[CreateWalletChallengeBodyBlockchainIdType0, CreateWalletChallengeBodyBlockchainIdType1,
            CreateWalletChallengeBodyBlockchainIdType2, CreateWalletChallengeBodyBlockchainIdType3, Unset]):
        external_customer_id (Union[Unset, str]):
        additional_information (Union[Unset, CreateWalletChallengeBodyAdditionalInformation]):
    """

    address: str
    namespace: CreateWalletChallengeBodyNamespace
    origin: str
    workflow_id: str
    blockchain_id: Union[
        CreateWalletChallengeBodyBlockchainIdType0,
        CreateWalletChallengeBodyBlockchainIdType1,
        CreateWalletChallengeBodyBlockchainIdType2,
        CreateWalletChallengeBodyBlockchainIdType3,
        Unset,
    ] = UNSET
    external_customer_id: Union[Unset, str] = UNSET
    additional_information: Union[Unset, "CreateWalletChallengeBodyAdditionalInformation"] = UNSET
    additional_properties: Dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        address: str
        address = self.address

        namespace = self.namespace.value

        origin = self.origin

        workflow_id = self.workflow_id

        blockchain_id: Union[Unset, str]
        if isinstance(self.blockchain_id, Unset):
            blockchain_id = UNSET
        elif isinstance(self.blockchain_id, CreateWalletChallengeBodyBlockchainIdType0):
            blockchain_id = self.blockchain_id.value
        elif isinstance(self.blockchain_id, CreateWalletChallengeBodyBlockchainIdType1):
            blockchain_id = self.blockchain_id.value
        elif isinstance(self.blockchain_id, CreateWalletChallengeBodyBlockchainIdType2):
            blockchain_id = self.blockchain_id.value
        else:
            blockchain_id = self.blockchain_id.value

        external_customer_id = self.external_customer_id

        additional_information: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.additional_information, Unset):
            additional_information = self.additional_information.to_dict()

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "address": address,
                "namespace": namespace,
                "origin": origin,
                "workflowId": workflow_id,
            }
        )
        if blockchain_id is not UNSET:
            field_dict["blockchainId"] = blockchain_id
        if external_customer_id is not UNSET:
            field_dict["externalCustomerId"] = external_customer_id
        if additional_information is not UNSET:
            field_dict["additionalInformation"] = additional_information

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.create_wallet_challenge_body_additional_information import (
            CreateWalletChallengeBodyAdditionalInformation,
        )

        d = src_dict.copy()

        def _parse_address(data: object) -> str:
            return cast(str, data)

        address = _parse_address(d.pop("address"))

        namespace = CreateWalletChallengeBodyNamespace(d.pop("namespace"))

        origin = d.pop("origin")

        workflow_id = d.pop("workflowId")

        def _parse_blockchain_id(
            data: object,
        ) -> Union[
            CreateWalletChallengeBodyBlockchainIdType0,
            CreateWalletChallengeBodyBlockchainIdType1,
            CreateWalletChallengeBodyBlockchainIdType2,
            CreateWalletChallengeBodyBlockchainIdType3,
            Unset,
        ]:
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, str):
                    raise TypeError()
                blockchain_id_type_0 = CreateWalletChallengeBodyBlockchainIdType0(data)

                return blockchain_id_type_0
            except:  # noqa: E722
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                blockchain_id_type_1 = CreateWalletChallengeBodyBlockchainIdType1(data)

                return blockchain_id_type_1
            except:  # noqa: E722
                pass
            try:
                if not isinstance(data, str):
                    raise TypeError()
                blockchain_id_type_2 = CreateWalletChallengeBodyBlockchainIdType2(data)

                return blockchain_id_type_2
            except:  # noqa: E722
                pass
            if not isinstance(data, str):
                raise TypeError()
            blockchain_id_type_3 = CreateWalletChallengeBodyBlockchainIdType3(data)

            return blockchain_id_type_3

        blockchain_id = _parse_blockchain_id(d.pop("blockchainId", UNSET))

        external_customer_id = d.pop("externalCustomerId", UNSET)

        _additional_information = d.pop("additionalInformation", UNSET)
        additional_information: Union[Unset, CreateWalletChallengeBodyAdditionalInformation]
        if isinstance(_additional_information, Unset):
            additional_information = UNSET
        else:
            additional_information = CreateWalletChallengeBodyAdditionalInformation.from_dict(_additional_information)

        create_wallet_challenge_body = cls(
            address=address,
            namespace=namespace,
            origin=origin,
            workflow_id=workflow_id,
            blockchain_id=blockchain_id,
            external_customer_id=external_customer_id,
            additional_information=additional_information,
        )

        create_wallet_challenge_body.additional_properties = d
        return create_wallet_challenge_body

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
