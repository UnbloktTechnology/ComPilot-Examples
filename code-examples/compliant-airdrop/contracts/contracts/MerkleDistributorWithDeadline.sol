// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import {MerkleDistributor} from './MerkleDistributor.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IERC20, SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

error EndTimeInPast();
error ClaimWindowFinished();
error NoWithdrawDuringClaim();
error InvalidRescue();

contract MerkleDistributorWithDeadline is MerkleDistributor, OwnableUpgradeable {
    using SafeERC20 for IERC20;

    uint256 public endTime;

    function initialize(
        address owner_,
        address token_,
        bytes32 merkleRoot_,
        uint256 endTime_,
        address signerAddress
    ) external initializer {
        _transferOwnership(owner_);
        __MerkleDistributor_init(token_, merkleRoot_, signerAddress);
        if (endTime_ <= block.timestamp) revert EndTimeInPast();
        endTime = endTime_;
    }

    /**
     * @dev Claims the specified amount of tokens for the specified index.
     * Can only be called before the endTime.
     * @param index index of the account to claim tokens for.
     * @param amount amount of tokens to claim.
     * @param merkleProof Merkle proof of the claim.
     */
    function claim(uint256 index, uint256 amount, bytes32[] calldata merkleProof) public override {
        if (block.timestamp >= endTime) revert ClaimWindowFinished();
        super.claim(index, amount, merkleProof);
    }

    /**
     * @dev Withdraws the remaining tokens from the contract.
     * Can only be called after the endTime.
     */
    function withdraw() external onlyOwner {
        if (block.timestamp < endTime) revert NoWithdrawDuringClaim();
        IERC20(token).safeTransfer(msg.sender, IERC20(token).balanceOf(address(this)));
    }

    /**
     * @dev Rescues random tokens stuck in the contract.
     * @param token_ address of the token to rescue.
     */
    function rescueToken(address token_) external onlyOwner {
        if (token_ == token) revert InvalidRescue(); // use withdraw instead
        uint256 amount = IERC20(token_).balanceOf(address(this));
        IERC20(token_).safeTransfer(msg.sender, amount);
    }
}
