// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSend {
    // Function to send native tokens to multiple addresses
    function multisend(uint256 amountPerAddy, address[] calldata recipients) external payable {
        require(msg.value == amountPerAddy * recipients.length, "Insufficient Ether sent");

        for (uint256 i = 0; i < recipients.length; i++) {
            payable(recipients[i]).transfer(amountPerAddy);
        }

        // If there is any leftover ETH, refund it
        uint256 remaining = msg.value - (amountPerAddy * recipients.length);
        assert(remaining == 0);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
