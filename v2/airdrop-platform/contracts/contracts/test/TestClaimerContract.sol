// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../interfaces/IMerkleDistributor.sol";

error ClaimReverted(bytes reason);

contract TestClaimerContract {
    function claim(address distributor, bytes calldata callData) external {
        (bool res, bytes memory data) = distributor.call(callData);
        if (!res) {
            revert ClaimReverted(data);
        }
    }
}
