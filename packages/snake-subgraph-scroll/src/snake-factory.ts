import { BigInt, DataSourceTemplate } from "@graphprotocol/graph-ts";
import {
  GameCreated as GameCreatedEvent,
  TournamentCreated as TournamentCreatedEvent,
} from "../generated/SnakeFactory/SnakeFactory";
import {
  Game,
  GameCreated,
  PlayerScore,
  TournamentCreated,
  TournamentGame,
} from "../generated/schema";

export function handleGameCreated(event: GameCreatedEvent): void {
  DataSourceTemplate.create("LobbyGame", [event.params.gameAddress.toHex()]);

  let entity = new GameCreated(event.params.gameAddress);
  entity.gameAddress = event.params.gameAddress;
  entity.creator = event.params.creator;
  entity.name = event.params.name;
  entity.stakeAmount = event.params.stakeAmount;
  entity.maxPlayers = event.params.maxPlayers;
  entity.duration = event.params.duration;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.started = false;
  entity.ended = false;
  entity.numOfPlayers = 1;

  let game = Game.load(event.params.gameAddress);
  if (game === null) {
    game = new Game(event.params.gameAddress);
    game.address = event.params.gameAddress;
    game.creator = event.params.creator;
    game.name = event.params.name;
    game.stakeAmount = event.params.stakeAmount;
    game.maxPlayers = event.params.maxPlayers;
    game.duration = event.params.duration;
    game.started = false;
    game.ended = false;
    game.numOfPlayers = 1;
    game.save();
  }

  let playerScore = PlayerScore.load(event.params.creator);
  if (playerScore === null) {
    playerScore = new PlayerScore(event.params.creator);
    playerScore.player = event.params.creator;
    playerScore.score = BigInt.fromI32(0);
    playerScore.game = event.params.gameAddress;
    playerScore.quitted = false;
    playerScore.save();
  }

  entity.save();
}

export function handleTournamentCreated(event: TournamentCreatedEvent): void {
  DataSourceTemplate.create("TournamentGame", [
    event.params.tournamentAddress.toHex(),
  ]);

  let entity = new TournamentCreated(event.params.tournamentAddress);
  entity.tournamentAddress = event.params.tournamentAddress;
  entity.name = event.params.name;
  entity.duration = event.params.duration;
  entity.entryFee = event.params.entryFee;
  entity.maxPlayers = event.params.maxPlayers;
  entity.isWeekly = event.params.isWeekly;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.ended = false;
  entity.numOfPlayers = 0;

  let tournamentGame = TournamentGame.load(event.params.tournamentAddress);
  if (tournamentGame === null) {
    tournamentGame = new TournamentGame(event.params.tournamentAddress);
    tournamentGame.address = event.params.tournamentAddress;
    tournamentGame.name = event.params.name;
    tournamentGame.duration = event.params.duration;
    tournamentGame.entryFee = event.params.entryFee;
    tournamentGame.maxPlayers = event.params.maxPlayers;
    tournamentGame.isWeekly = event.params.isWeekly;
    tournamentGame.started = true;
    tournamentGame.ended = false;
    tournamentGame.numOfPlayers = 0;
    tournamentGame.save();
  }

  entity.save();
}
