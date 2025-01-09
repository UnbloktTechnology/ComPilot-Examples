// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@nexeraid/sig-gating-contracts/contracts/sigVerifiers/TxAuthDataVerifier.sol";

contract GatedToken is ERC20, TxAuthDataVerifier {
    constructor(address signerManager) 
        ERC20("Gated Token", "GTK")
        TxAuthDataVerifier(signerManager)
    {}

    function mint(address to, uint256 amount) public requireTxDataAuth {
        _mint(to, amount);
    }
}