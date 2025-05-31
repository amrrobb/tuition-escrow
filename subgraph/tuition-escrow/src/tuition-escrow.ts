import {
  Deposited as DepositedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Refunded as RefundedEvent,
  Released as ReleasedEvent
} from "../generated/TuitionEscrow/TuitionEscrow"
import {
  Deposited,
  OwnershipTransferred,
  Refunded,
  Released
} from "../generated/schema"

export function handleDeposited(event: DepositedEvent): void {
  let entity = new Deposited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paymentId = event.params.paymentId
  entity.payer = event.params.payer
  entity.university = event.params.university
  entity.amount = event.params.amount
  entity.invoiceRef = event.params.invoiceRef

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRefunded(event: RefundedEvent): void {
  let entity = new Refunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paymentId = event.params.paymentId
  entity.payer = event.params.payer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReleased(event: ReleasedEvent): void {
  let entity = new Released(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paymentId = event.params.paymentId
  entity.university = event.params.university
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
