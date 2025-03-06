import {
  GameCreated as GameCreatedEvent,
  TournamentCreated as TournamentCreatedEvent
} from "../generated/SnakeFactory/SnakeFactory"
import { GameCreated, TournamentCreated } from "../generated/schema"

export function handleGameCreated(event: GameCreatedEvent): void {
  let entity = new GameCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameAddress = event.params.gameAddress
  entity.creator = event.params.creator
  entity.name = event.params.name
  entity.stakeAmount = event.params.stakeAmount
  entity.maxPlayers = event.params.maxPlayers
  entity.duration = event.params.duration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTournamentCreated(event: TournamentCreatedEvent): void {
  let entity = new TournamentCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tournamentAddress = event.params.tournamentAddress
  entity.name = event.params.name
  entity.duration = event.params.duration
  entity.entryFee = event.params.entryFee
  entity.maxPlayers = event.params.maxPlayers
  entity.isWeekly = event.params.isWeekly

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
