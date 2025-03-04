import { DataSourceTemplate } from "@graphprotocol/graph-ts";
import { GameCreated as GameCreatedEvent } from "../generated/SnakeFactory/SnakeFactory";
import { GameCreated } from "../generated/schema";

export function handleGameCreated(event: GameCreatedEvent): void {
  DataSourceTemplate.create("LobbyGame", [event.params.gameAddress.toHex()]);

  let entity = new GameCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.gameAddress = event.params.gameAddress;
  entity.creator = event.params.creator;
  entity.stakeAmount = event.params.stakeAmount;
  entity.maxPlayers = event.params.maxPlayers;
  entity.duration = event.params.duration;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
