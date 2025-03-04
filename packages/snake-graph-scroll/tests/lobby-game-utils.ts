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
  winners: Array<Address>,
  highestScore: BigInt,
  prizeShare: BigInt
): GameEnded {
  let gameEndedEvent = changetype<GameEnded>(newMockEvent())

  gameEndedEvent.parameters = new Array()

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

  return gameEndedEvent
}

export function createGameStartedEvent(startTime: BigInt): GameStarted {
  let gameStartedEvent = changetype<GameStarted>(newMockEvent())

  gameStartedEvent.parameters = new Array()

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
  stakeAmount: BigInt
): PlayerJoined {
  let playerJoinedEvent = changetype<PlayerJoined>(newMockEvent())

  playerJoinedEvent.parameters = new Array()

  playerJoinedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "stakeAmount",
      ethereum.Value.fromUnsignedBigInt(stakeAmount)
    )
  )

  return playerJoinedEvent
}

export function createPlayerQuitEvent(
  player: Address,
  refundAmount: BigInt
): PlayerQuit {
  let playerQuitEvent = changetype<PlayerQuit>(newMockEvent())

  playerQuitEvent.parameters = new Array()

  playerQuitEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerQuitEvent.parameters.push(
    new ethereum.EventParam(
      "refundAmount",
      ethereum.Value.fromUnsignedBigInt(refundAmount)
    )
  )

  return playerQuitEvent
}

export function createScoreSubmittedEvent(
  player: Address,
  score: BigInt
): ScoreSubmitted {
  let scoreSubmittedEvent = changetype<ScoreSubmitted>(newMockEvent())

  scoreSubmittedEvent.parameters = new Array()

  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("score", ethereum.Value.fromUnsignedBigInt(score))
  )

  return scoreSubmittedEvent
}
