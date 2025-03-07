import {
  TGameEnded as TGameEndedEvent,
  TPlayerJoined as TPlayerJoinedEvent,
  TScoreSubmitted as TScoreSubmittedEvent,
} from "../generated/TournamentGame/TournamentGame";
import {
  TGameEnded,
  TournamentCreated,
  TPlayerJoined,
  TPlayerScore,
  TScoreSubmitted,
} from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleTGameEnded(event: TGameEndedEvent): void {
  let entity = new TGameEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.contractAddress = event.params.contractAddress;
  entity.players = changetype<Bytes[]>(event.params.players);
  entity.highestScore = event.params.highestScore;
  entity.prizeShare = event.params.prizeShare;
  entity.creatorFee = event.params.creatorFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let tournamentCreated = TournamentCreated.load(event.params.contractAddress);
  if (tournamentCreated !== null) {
    tournamentCreated.ended = true;
    tournamentCreated.save();
  }

  entity.save();
}

export function handleTPlayerJoined(event: TPlayerJoinedEvent): void {
  let entity = new TPlayerJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.player = event.params.player;
  entity.contractAddress = event.params.contractAddress;
  entity.entryFee = event.params.entryFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let tournamentCreated = TournamentCreated.load(event.params.contractAddress);
  if (tournamentCreated !== null) {
    tournamentCreated.numOfPlayers = tournamentCreated.numOfPlayers + 1;
    tournamentCreated.save();
  }

  let tPlayerScore = TPlayerScore.load(event.params.player);
  if (tPlayerScore === null) {
    tPlayerScore = new TPlayerScore(event.params.player);
    tPlayerScore.player = event.params.player;
    tPlayerScore.score = BigInt.fromI32(0);
    tPlayerScore.game = event.params.contractAddress;
    tPlayerScore.save();
  }

  entity.save();
}

export function handleTScoreSubmitted(event: TScoreSubmittedEvent): void {
  let entity = new TScoreSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.player = event.params.player;
  entity.contractAddress = event.params.contractAddress;
  entity.score = event.params.score;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let tPlayerScore = TPlayerScore.load(event.params.player);
  if (tPlayerScore !== null) {
    tPlayerScore.score = event.params.score;
    tPlayerScore.save();
  }

  entity.save();
}
