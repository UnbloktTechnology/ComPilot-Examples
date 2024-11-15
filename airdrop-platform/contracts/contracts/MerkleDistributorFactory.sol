// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/proxy/Clones.sol';
import {IERC20, SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './MerkleDistributorWithDeadline.sol';

/// @title MerkleDistributorFactory
/// @notice A factory contract for creating MerkleDistributor and MerkleDistributorWithDeadline instances
contract MerkleDistributorFactory {
    using Clones for address;
    using SafeERC20 for IERC20;

    /// @notice Emitted when a new MerkleDistributor or MerkleDistributorWithDeadline is created
    /// @param proxy The address of the newly created distributor
    /// @param kind The type of distributor created ("MerkleDistributor" or "MerkleDistributorWithDeadline")
    event MerkleDistributorCreated(address indexed proxy, string kind);

    /// @notice The template instance for MerkleDistributor
    MerkleDistributor public instance;

    /// @notice The template instance for MerkleDistributorWithDeadline
    MerkleDistributorWithDeadline public instanceWithDeadline;

    /// @notice Initializes the factory by creating template instances
    constructor() {
        instance = new MerkleDistributor();
        instanceWithDeadline = new MerkleDistributorWithDeadline();
    }

    /// @notice Creates a new MerkleDistributor instance
    /// @param token_ The address of the ERC20 token to be distributed
    /// @param merkleRoot_ The merkle root of the distribution
    /// @param totalBalance_ The total amount of tokens to be distributed
    /// @param signer_ The address of the signer for the distribution
    /// @return The newly created MerkleDistributor instance
    function createDistributor(
        address token_,
        bytes32 merkleRoot_,
        uint256 totalBalance_,
        address signer_
    ) external returns (MerkleDistributor) {
        MerkleDistributor distributor = MerkleDistributor(address(instance).clone());

        distributor.initialize(token_, merkleRoot_, signer_);
        IERC20(token_).safeTransferFrom(msg.sender, address(distributor), totalBalance_);
        emit MerkleDistributorCreated(address(distributor), 'MerkleDistributor');

        return distributor;
    }

    /// @notice Creates a new MerkleDistributorWithDeadline instance
    /// @param token_ The address of the ERC20 token to be distributed
    /// @param merkleRoot_ The merkle root of the distribution
    /// @param endTime_ The deadline for the distribution
    /// @param totalBalance_ The total amount of tokens to be distributed
    /// @param signer_ The address of the signer for the distribution
    /// @return The newly created MerkleDistributorWithDeadline instance
    function createDistributorWithDeadline(
        address token_,
        bytes32 merkleRoot_,
        uint256 endTime_,
        uint256 totalBalance_,
        address signer_
    ) external returns (MerkleDistributorWithDeadline) {
        MerkleDistributorWithDeadline distributor = MerkleDistributorWithDeadline(
            address(instanceWithDeadline).clone()
        );

        distributor.initialize(msg.sender, token_, merkleRoot_, endTime_, signer_);
        IERC20(token_).safeTransferFrom(msg.sender, address(distributor), totalBalance_);
        emit MerkleDistributorCreated(address(distributor), 'MerkleDistributorWithDeadline');

        return distributor;
    }
}
