// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {TuitionEscrow} from "../../src/TuitionEscrow.sol";

// Malicious university contract that tries to reenter the escrow
contract MaliciousUniversity {
    TuitionEscrow public escrow;
    uint256 public paymentId;

    constructor(
        TuitionEscrow _escrow
    ) {
        escrow = _escrow;
    }

    // Fallback function to attempt reentrancy
    receive() external payable {
        // Try to reenter the release function
        escrow.release(paymentId);
    }

    function setPaymentId(
        uint256 _paymentId
    ) external {
        paymentId = _paymentId;
    }
}
