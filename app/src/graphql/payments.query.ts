import { gql } from "graphql-request";

export const queryDepositedPayments = gql`
	query QueryDepositedPayments($first: Int) {
		payments(
			first: $first
			orderDirection: desc
			orderBy: createdBlockTimestamp
			where: { status: "Deposited" }
		) {
			id
			paymentId
			payer
			university
			invoiceRef
			status
			amount
			updatedBlockTimestamp
			createdBlockTimestamp
		}
	}
`;

export const queryCompletedPayments = gql`
	query QueryCompletedPayments($first: Int) {
		payments(
			first: $first
			orderDirection: desc
			orderBy: updatedBlockTimestamp
			where: { status_not: "Deposited" }
		) {
			id
			paymentId
			payer
			university
			invoiceRef
			status
			amount
			updatedBlockTimestamp
			createdBlockTimestamp
		}
	}
`;
