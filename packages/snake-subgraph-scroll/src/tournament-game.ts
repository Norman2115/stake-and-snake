import {
  TGameEnded as TGameEndedEvent,
  TPlayerJoined as TPlayerJoinedEvent,
  TScoreSubmitted as TScoreSubmittedEvent,
} from "../generated/TournamentGame/TournamentGame"
import { TGameEnded, TPlayerJoined, TScoreSubmitted } from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleTGameEnded(event: TGameEndedEvent): void {
  let entity = new TGameEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.contractAddress = event.params.contractAddress
  entity.players = changetype<Bytes[]>(event.params.players)
  entity.highestScore = event.params.highestScore
  entity.prizeShare = event.params.prizeShare
  entity.creatorFee = event.params.creatorFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTPlayerJoined(event: TPlayerJoinedEvent): void {
  let entity = new TPlayerJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.player = event.params.player
  entity.contractAddress = event.params.contractAddress
  entity.entryFee = event.params.entryFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTScoreSubmitted(event: TScoreSubmittedEvent): void {
  let entity = new TScoreSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.player = event.params.player
  entity.contractAddress = event.params.contractAddress
  entity.score = event.params.score

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
