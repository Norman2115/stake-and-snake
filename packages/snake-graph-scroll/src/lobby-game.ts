import {
  GameEnded as GameEndedEvent,
  GameStarted as GameStartedEvent,
  PlayerJoined as PlayerJoinedEvent,
  PlayerQuit as PlayerQuitEvent,
  ScoreSubmitted as ScoreSubmittedEvent,
} from "../generated/LobbyGame/LobbyGame";
import {
  GameCreated,
  GameEnded,
  GameStarted,
  PlayerJoined,
  PlayerQuit,
  ScoreSubmitted,
} from "../generated/schema";
import { Bytes } from "@graphprotocol/graph-ts";

export function handleGameEnded(event: GameEndedEvent): void {
  let entity = new GameEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.contractAddress = event.params.contractAddress;
  entity.winners = changetype<Bytes[]>(event.params.winners);
  entity.highestScore = event.params.highestScore;
  entity.prizeShare = event.params.prizeShare;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let game = GameCreated.load(event.params.contractAddress);
  if (game != null) {
    game.ended = true;
    game.save();
  }

  entity.save();
}

export function handleGameStarted(event: GameStartedEvent): void {
  let entity = new GameStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.contractAddress = event.params.contractAddress;
  entity.startTime = event.params.startTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let game = GameCreated.load(event.params.contractAddress);
  if (game != null) {
    game.started = true;
    game.save();
  }

  entity.save();
}

export function handlePlayerJoined(event: PlayerJoinedEvent): void {
  let entity = new PlayerJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.player = event.params.player;
  entity.stakeAmount = event.params.stakeAmount;
  entity.newPrizePool = event.params.newPrizePool;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePlayerQuit(event: PlayerQuitEvent): void {
  let entity = new PlayerQuit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.player = event.params.player;
  entity.refundAmount = event.params.refundAmount;
  entity.newPrizePool = event.params.newPrizePool;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleScoreSubmitted(event: ScoreSubmittedEvent): void {
  let entity = new ScoreSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.player = event.params.player;
  entity.score = event.params.score;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
