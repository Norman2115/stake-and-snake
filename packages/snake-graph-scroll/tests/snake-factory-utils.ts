import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { GameCreated } from "../generated/SnakeFactory/SnakeFactory"

export function createGameCreatedEvent(
  gameAddress: Address,
  creator: Address,
  name: string,
  stakeAmount: BigInt,
  maxPlayers: i32,
  duration: BigInt
): GameCreated {
  let gameCreatedEvent = changetype<GameCreated>(newMockEvent())

  gameCreatedEvent.parameters = new Array()

  gameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "gameAddress",
      ethereum.Value.fromAddress(gameAddress)
    )
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "stakeAmount",
      ethereum.Value.fromUnsignedBigInt(stakeAmount)
    )
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxPlayers",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(maxPlayers))
    )
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
    )
  )

  return gameCreatedEvent
}
