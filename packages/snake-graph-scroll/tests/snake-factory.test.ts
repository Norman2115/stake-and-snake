import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GameCreated } from "../generated/schema"
import { GameCreated as GameCreatedEvent } from "../generated/SnakeFactory/SnakeFactory"
import { handleGameCreated } from "../src/snake-factory"
import { createGameCreatedEvent } from "./snake-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let gameAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let stakeAmount = BigInt.fromI32(234)
    let maxPlayers = 123
    let duration = BigInt.fromI32(234)
    let newGameCreatedEvent = createGameCreatedEvent(
      gameAddress,
      creator,
      stakeAmount,
      maxPlayers,
      duration
    )
    handleGameCreated(newGameCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GameCreated created and stored", () => {
    assert.entityCount("GameCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "gameAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "stakeAmount",
      "234"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "maxPlayers",
      "123"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "duration",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
