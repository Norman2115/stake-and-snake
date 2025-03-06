import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  TGameEnded,
  TPlayerJoined,
  TScoreSubmitted
} from "../generated/TournamentGame/TournamentGame"

export function createTGameEndedEvent(
  contractAddress: Address,
  players: Array<Address>,
  highestScore: BigInt,
  prizeShare: BigInt,
  creatorFee: BigInt
): TGameEnded {
  let tGameEndedEvent = changetype<TGameEnded>(newMockEvent())

  tGameEndedEvent.parameters = new Array()

  tGameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  tGameEndedEvent.parameters.push(
    new ethereum.EventParam("players", ethereum.Value.fromAddressArray(players))
  )
  tGameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "highestScore",
      ethereum.Value.fromUnsignedBigInt(highestScore)
    )
  )
  tGameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "prizeShare",
      ethereum.Value.fromUnsignedBigInt(prizeShare)
    )
  )
  tGameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "creatorFee",
      ethereum.Value.fromUnsignedBigInt(creatorFee)
    )
  )

  return tGameEndedEvent
}

export function createTPlayerJoinedEvent(
  player: Address,
  contractAddress: Address,
  entryFee: BigInt
): TPlayerJoined {
  let tPlayerJoinedEvent = changetype<TPlayerJoined>(newMockEvent())

  tPlayerJoinedEvent.parameters = new Array()

  tPlayerJoinedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  tPlayerJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  tPlayerJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "entryFee",
      ethereum.Value.fromUnsignedBigInt(entryFee)
    )
  )

  return tPlayerJoinedEvent
}

export function createTScoreSubmittedEvent(
  player: Address,
  contractAddress: Address,
  score: BigInt
): TScoreSubmitted {
  let tScoreSubmittedEvent = changetype<TScoreSubmitted>(newMockEvent())

  tScoreSubmittedEvent.parameters = new Array()

  tScoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  tScoreSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  tScoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("score", ethereum.Value.fromUnsignedBigInt(score))
  )

  return tScoreSubmittedEvent
}
