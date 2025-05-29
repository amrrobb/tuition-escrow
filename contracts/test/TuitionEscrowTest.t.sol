// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import "../src/TuitionEscrow.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1_000_000 * 10 ** 18); // Mint 1M tokens
    }
}

contract TuitionEscrowTest is Test {
    TuitionEscrow escrow;
    MockUSDC usdc;
    address owner = address(0x1);
    address payer = address(0x2);
    address university = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        usdc = new MockUSDC();
        escrow = new TuitionEscrow(address(usdc));
        usdc.transfer(payer, 10_000 * 10 ** 18); // Transfer 10k USDC to payer
        vm.stopPrank();
    }

    function testInitialize() public {
        vm.prank(owner);
        uint256 paymentId = escrow.initialize(payer, university, 1000 * 10 ** 18, "INV123");
        assertEq(paymentId, 0);
        (address p, address u, uint256 a, string memory i, bool active) = escrow.payments(0);
        assertEq(p, payer);
        assertEq(u, university);
        assertEq(a, 1000 * 10 ** 18);
        assertEq(i, "INV123");
        assertTrue(active);
    }

    function testDeposit() public {
        vm.prank(owner);
        uint256 paymentId = escrow.initialize(payer, university, 1000 * 10 ** 18, "INV123");

        vm.startPrank(payer);
        usdc.approve(address(escrow), 1000 * 10 ** 18);
        escrow.deposit(paymentId);
        vm.stopPrank();

        assertEq(usdc.balanceOf(address(escrow)), 1000 * 10 ** 18);
        assertEq(usdc.balanceOf(payer), 9000 * 10 ** 18); // 10k - 1k
    }

    function testRelease() public {
        vm.prank(owner);
        uint256 paymentId = escrow.initialize(payer, university, 1000 * 10 ** 18, "INV123");

        vm.prank(payer);
        usdc.approve(address(escrow), 1000 * 10 ** 18);
        escrow.deposit(paymentId);

        vm.prank(owner);
        escrow.release(paymentId);

        assertEq(usdc.balanceOf(university), 1000 * 10 ** 18);
        assertEq(usdc.balanceOf(address(escrow)), 0);
        (,,,, bool active) = escrow.payments(paymentId);
        assertFalse(active);
    }

    function testRefund() public {
        vm.prank(owner);
        uint256 paymentId = escrow.initialize(payer, university, 1000 * 10 ** 18, "INV123");

        vm.prank(payer);
        usdc.approve(address(escrow), 1000 * 10 ** 18);
        escrow.deposit(paymentId);

        vm.prank(owner);
        escrow.refund(paymentId);

        assertEq(usdc.balanceOf(payer), 10_000 * 10 ** 18); // Full balance restored
        assertEq(usdc.balanceOf(address(escrow)), 0);
        (,,,, bool active) = escrow.payments(paymentId);
        assertFalse(active);
    }

    function testFailDoubleRelease() public {
        vm.prank(owner);
        uint256 paymentId = escrow.initialize(payer, university, 1000 * 10 ** 18, "INV123");

        vm.prank(payer);
        usdc.approve(address(escrow), 1000 * 10 ** 18);
        escrow.deposit(paymentId);

        vm.prank(owner);
        escrow.release(paymentId);
        escrow.release(paymentId); // Should revert
    }

    function testFailInvalidPayerDeposit() public {
        vm.prank(owner);
        uint256 paymentId = escrow.initialize(payer, university, 1000 * 10 ** 18, "INV123");

        vm.prank(university); // Wrong payer
        usdc.approve(address(escrow), 1000 * 10 ** 18);
        escrow.deposit(paymentId); // Should revert
    }
}
