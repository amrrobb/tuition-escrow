import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Deposited,
  OwnershipTransferred,
  Refunded,
  Released
} from "../generated/TuitionEscrow/TuitionEscrow"

export function createDepositedEvent(
  paymentId: BigInt,
  payer: Address,
  university: Address,
  amount: BigInt,
  invoiceRef: string
): Deposited {
  let depositedEvent = changetype<Deposited>(newMockEvent())

  depositedEvent.parameters = new Array()

  depositedEvent.parameters.push(
    new ethereum.EventParam(
      "paymentId",
      ethereum.Value.fromUnsignedBigInt(paymentId)
    )
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam(
      "university",
      ethereum.Value.fromAddress(university)
    )
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  depositedEvent.parameters.push(
    new ethereum.EventParam("invoiceRef", ethereum.Value.fromString(invoiceRef))
  )

  return depositedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRefundedEvent(
  paymentId: BigInt,
  payer: Address,
  amount: BigInt
): Refunded {
  let refundedEvent = changetype<Refunded>(newMockEvent())

  refundedEvent.parameters = new Array()

  refundedEvent.parameters.push(
    new ethereum.EventParam(
      "paymentId",
      ethereum.Value.fromUnsignedBigInt(paymentId)
    )
  )
  refundedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  )
  refundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return refundedEvent
}

export function createReleasedEvent(
  paymentId: BigInt,
  university: Address,
  amount: BigInt
): Released {
  let releasedEvent = changetype<Released>(newMockEvent())

  releasedEvent.parameters = new Array()

  releasedEvent.parameters.push(
    new ethereum.EventParam(
      "paymentId",
      ethereum.Value.fromUnsignedBigInt(paymentId)
    )
  )
  releasedEvent.parameters.push(
    new ethereum.EventParam(
      "university",
      ethereum.Value.fromAddress(university)
    )
  )
  releasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return releasedEvent
}
