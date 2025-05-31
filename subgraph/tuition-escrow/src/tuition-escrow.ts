import {
	Deposited,
	Released,
	Refunded,
} from "../generated/TuitionEscrow/TuitionEscrow";
import { Payment } from "../generated/schema";

export function handleDeposited(event: Deposited): void {
	let payment = Payment.load(event.params.paymentId.toString());
	if (!payment) {
		payment = new Payment(event.params.paymentId.toString());
		payment.paymentId = event.params.paymentId.toString();
	}
	payment.payer = event.params.payer;
	payment.university = event.params.university;
	payment.amount = event.params.amount;
	payment.invoiceRef = event.params.invoiceRef;
	payment.status = "Deposited";
	payment.createdBlockTimestamp = event.block.timestamp;
	payment.updatedBlockTimestamp = event.block.timestamp;
	payment.save();
}

export function handleReleased(event: Released): void {
	let payment = Payment.load(event.params.paymentId.toString());
	if (payment) {
		payment.status = "Released";
		payment.updatedBlockTimestamp = event.block.timestamp;
		payment.save();
	}
}

export function handleRefunded(event: Refunded): void {
	let payment = Payment.load(event.params.paymentId.toString());
	if (payment) {
		payment.status = "Refunded";
		payment.updatedBlockTimestamp = event.block.timestamp;
		payment.save();
	}
}
