// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import "../src/TuitionEscrow.sol";
import {MaliciousUniversity} from "./mock/MaliciousUniversity.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1_000_000 ether); // Mint 1M tokens
    }
}

contract TuitionEscrowTest is Test {
    TuitionEscrow escrow;
    MockUSDC usdc;
    address owner = makeAddr("owner");
    address payer = makeAddr("payer");
    address university = makeAddr("university");

    uint256 constant TUITION_AMOUNT = 1000 * 10 * 6; // 1k USDC
    uint256 constant PAYER_BALANCE = 10_000 * 10 * 6; // 10k USDC

    function setUp() public {
        vm.startPrank(owner);
        usdc = new MockUSDC();
        escrow = new TuitionEscrow(address(usdc));
        usdc.transfer(payer, PAYER_BALANCE); // Transfer 10k USDC to payer
        vm.stopPrank();
    }

    function testInitialize() public {
        vm.startPrank(owner);
        uint256 paymentId = escrow.initialize(payer, university, TUITION_AMOUNT, "INV123");
        vm.stopPrank();

        assertEq(paymentId, 1);
        (address p, address u, TuitionEscrow.PaymentStatus status, uint256 a, string memory i) =
            escrow.payments(1);

        assertEq(p, payer);
        assertEq(u, university);
        assertEq(a, TUITION_AMOUNT);
        assertEq(i, "INV123");
        assertEq(uint256(status), uint256(TuitionEscrow.PaymentStatus.Initialized));
    }

    function testDeposit() public {
        vm.startPrank(owner);
        uint256 paymentId = escrow.initialize(payer, university, TUITION_AMOUNT, "INV123");
        vm.stopPrank();

        vm.startPrank(payer);
        usdc.approve(address(escrow), TUITION_AMOUNT);
        escrow.deposit(paymentId);
        vm.stopPrank();

        assertEq(usdc.balanceOf(address(escrow)), TUITION_AMOUNT);
        assertEq(usdc.balanceOf(payer), PAYER_BALANCE - TUITION_AMOUNT); // 10k - 1k
    }

    function testRelease() public {
        vm.startPrank(owner);
        uint256 paymentId = escrow.initialize(payer, university, TUITION_AMOUNT, "INV123");
        vm.stopPrank();

        vm.startPrank(payer);
        usdc.approve(address(escrow), TUITION_AMOUNT);
        escrow.deposit(paymentId);
        vm.stopPrank();

        vm.startPrank(owner);
        escrow.release(paymentId);
        vm.stopPrank();

        assertEq(usdc.balanceOf(university), TUITION_AMOUNT);
        assertEq(usdc.balanceOf(address(escrow)), 0);
        (,, TuitionEscrow.PaymentStatus status,,) = escrow.payments(paymentId);
        assertEq(uint256(status), uint256(TuitionEscrow.PaymentStatus.Released));
    }

    function testRefund() public {
        vm.startPrank(owner);
        uint256 paymentId = escrow.initialize(payer, university, TUITION_AMOUNT, "INV123");
        vm.stopPrank();

        vm.startPrank(payer);
        usdc.approve(address(escrow), TUITION_AMOUNT);
        escrow.deposit(paymentId);
        vm.stopPrank();

        vm.startPrank(owner);
        escrow.refund(paymentId);
        vm.stopPrank();

        assertEq(usdc.balanceOf(payer), PAYER_BALANCE); // Full balance restored
        assertEq(usdc.balanceOf(address(escrow)), 0);
        (,, TuitionEscrow.PaymentStatus status,,) = escrow.payments(paymentId);
        assertEq(uint256(status), uint256(TuitionEscrow.PaymentStatus.Refunded));
    }

    function testRevertInvalidPayerDeposit() public {
        vm.startPrank(owner);
        uint256 paymentId = escrow.initialize(payer, university, TUITION_AMOUNT, "INV123");
        vm.stopPrank();

        vm.startPrank(university); // Wrong payer
        usdc.approve(address(escrow), TUITION_AMOUNT);
        vm.expectRevert(TuitionEscrow.InvalidPayer.selector);
        escrow.deposit(paymentId); // Should revert
        vm.stopPrank();
    }

    function testRevertReentrancyAttack() public {
        // Deploy the malicious university
        MaliciousUniversity maliciousUni = new MaliciousUniversity(escrow);
        (escrow);

        // Initialize a payment with the malicious university
        vm.startPrank(owner);
        uint256 paymentId =
            escrow.initialize(payer, address(maliciousUni), TUITION_AMOUNT, "INV123");
        vm.stopPrank();

        // Set the paymentId in the malicious contract
        maliciousUni.setPaymentId(paymentId);

        // Deposit funds
        vm.startPrank(payer);
        usdc.approve(address(escrow), TUITION_AMOUNT);
        escrow.deposit(paymentId);
        vm.stopPrank();

        // Attempt to release funds (should fail due to reentrancy guard)
        vm.startPrank(owner);
        escrow.release(paymentId);
        vm.stopPrank();
    }

    function testPaymentStatusTransitions() public {
        vm.startPrank(owner);
        uint256 paymentId = escrow.initialize(payer, university, TUITION_AMOUNT, "INV123");
        vm.stopPrank();

        // Check initial status
        (,, TuitionEscrow.PaymentStatus status, uint256 amount,) = escrow.payments(paymentId);
        assertEq(uint256(status), uint256(TuitionEscrow.PaymentStatus.Initialized));

        // Deposit
        vm.startPrank(payer);
        usdc.approve(address(escrow), amount);
        escrow.deposit(paymentId);
        vm.stopPrank();

        (,, TuitionEscrow.PaymentStatus statusAfterDeposit,,) = escrow.payments(paymentId);
        assertEq(uint256(statusAfterDeposit), uint256(TuitionEscrow.PaymentStatus.Deposited));

        // Try to deposit again (should fail)
        vm.startPrank(payer);
        usdc.approve(address(escrow), amount);
        vm.expectRevert(TuitionEscrow.PaymentAlreadyProcessed.selector);
        escrow.deposit(paymentId);
        vm.stopPrank();

        // Release
        vm.startPrank(owner);
        escrow.release(paymentId);
        vm.stopPrank();

        (,, TuitionEscrow.PaymentStatus statusAfterRelease,,) = escrow.payments(paymentId);
        assertEq(uint256(statusAfterRelease), uint256(TuitionEscrow.PaymentStatus.Released));

        // Try to release again (should fail)
        vm.startPrank(owner);
        vm.expectRevert(TuitionEscrow.PaymentAlreadyProcessed.selector);
        escrow.release(paymentId); // Should revert
        vm.stopPrank();
    }
}
