from http import HTTPStatus
from typing import Any, Dict, Optional, Union

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.verify_wallet_challenge_body import VerifyWalletChallengeBody
from ...models.verify_wallet_challenge_response_200 import VerifyWalletChallengeResponse200
from ...models.verify_wallet_challenge_response_401 import VerifyWalletChallengeResponse401
from ...models.verify_wallet_challenge_response_404 import VerifyWalletChallengeResponse404
from ...types import Response


def _get_kwargs(
    *,
    body: VerifyWalletChallengeBody,
) -> Dict[str, Any]:
    headers: Dict[str, Any] = {}

    _kwargs: Dict[str, Any] = {
        "method": "post",
        "url": "/public/auth-session/wallet/challenge/verify",
    }

    _body = body.to_dict()

    _kwargs["json"] = _body
    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Optional[
    Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
]:
    if response.status_code == HTTPStatus.OK:
        response_200 = VerifyWalletChallengeResponse200.from_dict(response.json())

        return response_200
    if response.status_code == HTTPStatus.UNAUTHORIZED:
        response_401 = VerifyWalletChallengeResponse401.from_dict(response.json())

        return response_401
    if response.status_code == HTTPStatus.NOT_FOUND:
        response_404 = VerifyWalletChallengeResponse404.from_dict(response.json())

        return response_404
    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Response[
    Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: Union[AuthenticatedClient, Client],
    body: VerifyWalletChallengeBody,
) -> Response[
    Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
]:
    """
    Args:
        body (VerifyWalletChallengeBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: Union[AuthenticatedClient, Client],
    body: VerifyWalletChallengeBody,
) -> Optional[
    Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
]:
    """
    Args:
        body (VerifyWalletChallengeBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
    """

    return sync_detailed(
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    *,
    client: Union[AuthenticatedClient, Client],
    body: VerifyWalletChallengeBody,
) -> Response[
    Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
]:
    """
    Args:
        body (VerifyWalletChallengeBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]]
    """

    kwargs = _get_kwargs(
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: Union[AuthenticatedClient, Client],
    body: VerifyWalletChallengeBody,
) -> Optional[
    Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
]:
    """
    Args:
        body (VerifyWalletChallengeBody):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Union[VerifyWalletChallengeResponse200, VerifyWalletChallengeResponse401, VerifyWalletChallengeResponse404]
    """

    return (
        await asyncio_detailed(
            client=client,
            body=body,
        )
    ).parsed
