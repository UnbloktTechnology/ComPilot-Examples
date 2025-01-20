/**
 * @title GatedToken
 * @dev Implementation of a signature-gated ERC20 token
 * 
 * Features:
 * 1. ERC20 standard implementation
 * 2. ComPilot signature verification
 * 3. Gated minting with authorization
 * 
 * Security:
 * - Uses TxAuthDataVerifier for signature checks
 * - Validates signer authorization
 * - Requires valid signature for minting
 * 
 * @notice All mints must be authorized by ComPilot signer
 * @custom:security-contact security@compilot.com
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@nexeraid/sig-gating-contracts/contracts/sigVerifiers/TxAuthDataVerifier.sol";

/**
 * @notice Main contract for gated token minting
 * @dev Inherits from ERC20 and TxAuthDataVerifier
 */
contract GatedToken is ERC20, TxAuthDataVerifier {
    /**
     * @notice Initializes token and verifier
     * @param signerManager Address of ComPilot's signer manager
     */
    constructor(address signerManager) 
        ERC20("Gated Token", "GTK")
        TxAuthDataVerifier(signerManager)
    {}

    /**
     * @notice Mints new tokens with signature verification
     * @dev Requires valid ComPilot signature
     * @param to Recipient address
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public requireTxDataAuth {
        _mint(to, amount);
    }
} 