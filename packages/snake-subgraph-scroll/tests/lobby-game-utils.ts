import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GameEnded,
  GameStarted,
  PlayerJoined,
  PlayerQuit,
  ScoreSubmitted
} from "../generated/LobbyGame/LobbyGame"

export function createGameEndedEvent(
  contractAddress: Address,
  winners: Array<Address>,
  highestScore: BigInt,
  prizeShare: BigInt,
  creatorFee: BigInt
): GameEnded {
  let gameEndedEvent = changetype<GameEnded>(newMockEvent())

  gameEndedEvent.parameters = new Array()

  gameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  gameEndedEvent.parameters.push(
    new ethereum.EventParam("winners", ethereum.Value.fromAddressArray(winners))
  )
  gameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "highestScore",
      ethereum.Value.fromUnsignedBigInt(highestScore)
    )
  )
  gameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "prizeShare",
      ethereum.Value.fromUnsignedBigInt(prizeShare)
    )
  )
  gameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "creatorFee",
      ethereum.Value.fromUnsignedBigInt(creatorFee)
    )
  )

  return gameEndedEvent
}

export function createGameStartedEvent(
  contractAddress: Address,
  startTime: BigInt
): GameStarted {
  let gameStartedEvent = changetype<GameStarted>(newMockEvent())

  gameStartedEvent.parameters = new Array()

  gameStartedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  gameStartedEvent.parameters.push(
    new ethereum.EventParam(
      "startTime",
      ethereum.Value.fromUnsignedBigInt(startTime)
    )
  )

  return gameStartedEvent
}

export function createPlayerJoinedEvent(
  player: Address,
  contractAddress: Address,
  stakeAmount: BigInt,
  newPrizePool: BigInt
): PlayerJoined {
  let playerJoinedEvent = changetype<PlayerJoined>(newMockEvent())

  playerJoinedEvent.parameters = new Array()

  playerJoinedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  playerJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "stakeAmount",
      ethereum.Value.fromUnsignedBigInt(stakeAmount)
    )
  )
  playerJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "newPrizePool",
      ethereum.Value.fromUnsignedBigInt(newPrizePool)
    )
  )

  return playerJoinedEvent
}

export function createPlayerQuitEvent(
  player: Address,
  contractAddress: Address,
  refundAmount: BigInt,
  newPrizePool: BigInt
): PlayerQuit {
  let playerQuitEvent = changetype<PlayerQuit>(newMockEvent())

  playerQuitEvent.parameters = new Array()

  playerQuitEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerQuitEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  playerQuitEvent.parameters.push(
    new ethereum.EventParam(
      "refundAmount",
      ethereum.Value.fromUnsignedBigInt(refundAmount)
    )
  )
  playerQuitEvent.parameters.push(
    new ethereum.EventParam(
      "newPrizePool",
      ethereum.Value.fromUnsignedBigInt(newPrizePool)
    )
  )

  return playerQuitEvent
}

export function createScoreSubmittedEvent(
  player: Address,
  contractAddress: Address,
  score: BigInt
): ScoreSubmitted {
  let scoreSubmittedEvent = changetype<ScoreSubmitted>(newMockEvent())

  scoreSubmittedEvent.parameters = new Array()

  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("score", ethereum.Value.fromUnsignedBigInt(score))
  )

  return scoreSubmittedEvent
}
