import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GameEnded } from "../generated/schema"
import { GameEnded as GameEndedEvent } from "../generated/LobbyGame/LobbyGame"
import { handleGameEnded } from "../src/lobby-game"
import { createGameEndedEvent } from "./lobby-game-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let winners = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ]
    let highestScore = BigInt.fromI32(234)
    let prizeShare = BigInt.fromI32(234)
    let newGameEndedEvent = createGameEndedEvent(
      winners,
      highestScore,
      prizeShare
    )
    handleGameEnded(newGameEndedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GameEnded created and stored", () => {
    assert.entityCount("GameEnded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "winners",
      "[0x0000000000000000000000000000000000000001]"
    )
    assert.fieldEquals(
      "GameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "highestScore",
      "234"
    )
    assert.fieldEquals(
      "GameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "prizeShare",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
