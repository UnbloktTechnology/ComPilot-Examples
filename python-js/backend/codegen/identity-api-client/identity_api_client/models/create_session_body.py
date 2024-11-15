from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.create_session_body_additional_information import CreateSessionBodyAdditionalInformation


T = TypeVar("T", bound="CreateSessionBody")


@_attrs_define
class CreateSessionBody:
    """
    Attributes:
        workflow_id (str):
        external_customer_id (str):
        additional_information (Union[Unset, CreateSessionBodyAdditionalInformation]):
    """

    workflow_id: str
    external_customer_id: str
    additional_information: Union[Unset, "CreateSessionBodyAdditionalInformation"] = UNSET
    additional_properties: Dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        workflow_id = self.workflow_id

        external_customer_id = self.external_customer_id

        additional_information: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.additional_information, Unset):
            additional_information = self.additional_information.to_dict()

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "workflowId": workflow_id,
                "externalCustomerId": external_customer_id,
            }
        )
        if additional_information is not UNSET:
            field_dict["additionalInformation"] = additional_information

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.create_session_body_additional_information import CreateSessionBodyAdditionalInformation

        d = src_dict.copy()
        workflow_id = d.pop("workflowId")

        external_customer_id = d.pop("externalCustomerId")

        _additional_information = d.pop("additionalInformation", UNSET)
        additional_information: Union[Unset, CreateSessionBodyAdditionalInformation]
        if isinstance(_additional_information, Unset):
            additional_information = UNSET
        else:
            additional_information = CreateSessionBodyAdditionalInformation.from_dict(_additional_information)

        create_session_body = cls(
            workflow_id=workflow_id,
            external_customer_id=external_customer_id,
            additional_information=additional_information,
        )

        create_session_body.additional_properties = d
        return create_session_body

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
