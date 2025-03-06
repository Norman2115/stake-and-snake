import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { TGameEnded } from "../generated/schema"
import { TGameEnded as TGameEndedEvent } from "../generated/TournamentGame/TournamentGame"
import { handleTGameEnded } from "../src/tournament-game"
import { createTGameEndedEvent } from "./tournament-game-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let contractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let players = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ]
    let highestScore = BigInt.fromI32(234)
    let prizeShare = BigInt.fromI32(234)
    let creatorFee = BigInt.fromI32(234)
    let newTGameEndedEvent = createTGameEndedEvent(
      contractAddress,
      players,
      highestScore,
      prizeShare,
      creatorFee
    )
    handleTGameEnded(newTGameEndedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TGameEnded created and stored", () => {
    assert.entityCount("TGameEnded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TGameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contractAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TGameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "players",
      "[0x0000000000000000000000000000000000000001]"
    )
    assert.fieldEquals(
      "TGameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "highestScore",
      "234"
    )
    assert.fieldEquals(
      "TGameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "prizeShare",
      "234"
    )
    assert.fieldEquals(
      "TGameEnded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creatorFee",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
