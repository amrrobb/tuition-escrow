// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title TuitionEscrow
/// @notice Manages tuition payments between students and universities using stablecoin
/// @dev Uses OpenZeppelin's Ownable and ReentrancyGuard for security
contract TuitionEscrow is Ownable, ReentrancyGuard {
    /// @notice Stablecoin used for payments (e.g. USDC)
    IERC20 public immutable stablecoin;

    struct Payment {
        uint256 amount; // Payment amount in stablecoin
        address payer; // Student address
        address university; // University address
        bool isActive; // Payment status
        string invoiceRef; // Invoice identifier
    }

    /// @notice Stores all payment details
    mapping(uint256 => Payment) public payments;

    /// @notice Tracks total number of payments
    uint256 public paymentCounter;

    /// @notice Emitted when funds are deposited into escrow
    event Deposited(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed university,
        uint256 amount,
        string invoiceRef
    );

    /// @notice Emitted when funds are released to the university
    event Released(uint256 indexed paymentId, address indexed university, uint256 amount);

    /// @notice Emitted when funds are refunded to the payer
    event Refunded(uint256 indexed paymentId, address indexed payer, uint256 amount);

    /// @notice Error for when a payment is already processed
    error PaymentAlreadyProcessed();

    /// @notice Error for when a transfer fails
    error TransferFailed();

    /// @notice Error for when the deposit amount is invalid
    error InvalidAmount();

    /// @notice Error for when the payment ID is invalid
    error InvalidPaymentId();

    /// @notice Sets up the contract with specified stablecoin
    /// @param _stablecoin Address of the stablecoin contract
    constructor(
        address _stablecoin
    ) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
    }

    /// @notice Creates a new payment record
    /// @param payer Address of the student
    /// @param university Address of the university
    /// @param amount Payment amount in stablecoin
    /// @param invoiceRef Reference number for the invoice
    /// @return paymentId Unique identifier for the payment
    function initialize(
        address payer,
        address university,
        uint256 amount,
        string calldata invoiceRef
    ) external onlyOwner returns (uint256) {
        if (amount == 0) revert InvalidAmount();

        uint256 paymentId = paymentCounter++;
        payments[paymentId] = Payment({
            payer: payer,
            university: university,
            amount: amount,
            invoiceRef: invoiceRef,
            isActive: true
        });

        return paymentId;
    }

    /// @notice Deposits funds for a specific payment
    /// @param paymentId Identifier of the payment
    function deposit(
        uint256 paymentId
    ) external nonReentrant {
        Payment storage payment = payments[paymentId];
        if (!payment.isActive) revert PaymentAlreadyProcessed();
        if (payment.payer != msg.sender) revert InvalidPaymentId();

        if (!stablecoin.transferFrom(msg.sender, address(this), payment.amount)) {
            revert TransferFailed();
        }
        emit Deposited(
            paymentId, payment.payer, payment.university, payment.amount, payment.invoiceRef
        );
    }

    /// @notice Releases funds to the university
    /// @param paymentId Identifier of the payment
    function release(
        uint256 paymentId
    ) external onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        if (!payment.isActive) revert PaymentAlreadyProcessed();

        payment.isActive = false;
        if (!stablecoin.transfer(payment.university, payment.amount)) revert TransferFailed();

        emit Released(paymentId, payment.university, payment.amount);
    }

    /// @notice Refunds payment back to the student
    /// @param paymentId Identifier of the payment
    function refund(
        uint256 paymentId
    ) external onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        if (!payment.isActive) revert PaymentAlreadyProcessed();

        payment.isActive = false;
        if (!stablecoin.transfer(payment.payer, payment.amount)) revert TransferFailed();
        emit Refunded(paymentId, payment.payer, payment.amount);
    }
}
