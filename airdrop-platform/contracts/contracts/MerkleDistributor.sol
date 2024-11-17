// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import {IERC20, SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {MerkleProof} from '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import {Initializable} from '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import '@nexeraprotocol/nexera-id-sig-gating-contracts/contracts/sigVerifiers/TxAuthDataVerifierUpgradeable.sol';

import {IMerkleDistributor} from './interfaces/IMerkleDistributor.sol';

error InvalidToken();
error AlreadyClaimed();
error InvalidProof(bytes32 merkleRoot);

contract MerkleDistributor is IMerkleDistributor, TxAuthDataVerifierUpgradeable {
    using SafeERC20 for IERC20;

    uint256 private constant WORD_SIZE = 256;
    address public override token;
    bytes32 public override merkleRoot;

    // This is a packed array of booleans.
    mapping(uint256 => uint256) private claimedBitMap;

    function initialize(address token_, bytes32 merkleRoot_, address signer_) external initializer {
        __MerkleDistributor_init(token_, merkleRoot_, signer_);
    }

    function __MerkleDistributor_init(address token_, bytes32 merkleRoot_, address signer_) internal {
        __TxAuthDataVerifierUpgradeable_init(signer_);
        if (token_ == address(0)) revert InvalidToken();
        token = token_;
        merkleRoot = merkleRoot_;
    }

    function isClaimed(uint256 index) public view override returns (bool) {
        uint256 claimedWordIndex = index / WORD_SIZE;
        uint256 claimedBitIndex = index % WORD_SIZE;
        uint256 claimedWord = claimedBitMap[claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }

    function _setClaimed(uint256 index) private {
        uint256 claimedWordIndex = index / WORD_SIZE;
        uint256 claimedBitIndex = index % WORD_SIZE;
        claimedBitMap[claimedWordIndex] = claimedBitMap[claimedWordIndex] | (1 << claimedBitIndex);
    }

    function claim(
        uint256 index,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) public virtual override requireTxDataAuth {
        if (isClaimed(index)) revert AlreadyClaimed();

        // Verify the merkle proof.
        address account = msg.sender;
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        if (!MerkleProof.verify(merkleProof, merkleRoot, node)) revert InvalidProof(merkleRoot);

        // Mark it claimed and send the token.
        _setClaimed(index);
        IERC20(token).safeTransfer(account, amount);

        emit Claimed(index, account, amount);
    }
}
