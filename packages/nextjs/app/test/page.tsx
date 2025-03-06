"use client";

import React from "react";
import { NextPage } from "next";
import { parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import abi from "~~/abi/LobbyGame.json";

const Test: NextPage = () => {
  const prizePool = useReadContract({
    abi,
    address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
    functionName: "getPrizePool",
  });

  const yourData = useReadContract({
    abi,
    address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
    functionName: "yourFunctionName",
  });

  const winners = useReadContract({
    abi,
    address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
    functionName: "getWinners",
  });

  const hasPlayerSubmittedScore = useReadContract({
    abi,
    address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
    functionName: "hasPlayerSubmittedScore",
    args: ["0x7F74bA32C8E1cBa7495f44EeacE361Dbec084a36"],
  });

  const players = useReadContract({
    abi,
    address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
    functionName: "getPlayers",
  });

  const playerScore = useReadContract({
    abi,
    address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
    functionName: "getPlayerScore",
    args: ["0x1f497Ca741399409b399eb540ae2f1D9eC6b89d5"],
  });

  // Use Write Contract for Writing to the Contract
  const { writeContract } = useWriteContract();
  const amount = parseEther("0.0001");

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Testing LobbyGame v1</h1>
      {/* Test Join Game Function */}
      <button
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white mb-3"
        onClick={() =>
          writeContract({
            abi,
            address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
            functionName: "joinGame",
            args: [],
            value: parseEther("0.0001"),
          })
        }
      >
        Join Game (Tested)
      </button>

      {/* Test submitScore(uint256) Function */}
      <button
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white mb-3"
        onClick={() =>
          writeContract({
            abi,
            address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
            functionName: "submitScore",
            args: [50],
          })
        }
      >
        Submit Score (Tested)
      </button>

      <button
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white mb-3"
        onClick={() =>
          writeContract({
            abi,
            address: "0x75B8F4089a30C5c19081908676Ff24449DEee2f5",
            functionName: "startGame",
          })
        }
      >
        Start Game
      </button>

      {/* Test endGame() Function */}
      <button
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white mb-3"
        onClick={() =>
          writeContract({
            abi,
            address: "0xB5A7a73EcFfD7AA5D0152BE2425fADD06a818c42",
            functionName: "endGame",
            args: [],
          })
        }
      >
        End Game
      </button>

      {/* Fetch Prize Pool */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Prize Pool</h2>
        <p>{prizePool.data?.toString() || "No prize pool yet"}</p>
      </div>

      {/* Fetch Winners */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Winners</h2>
        <p>{winners.data?.toString() || "No winners yet"}</p>
      </div>

      {/* Fetch Has Player Submitted Score */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Has Player Submitted Score</h2>
        <p>{hasPlayerSubmittedScore.data?.toString() || "Player has not submitted score"}</p>
      </div>

      {/* Fetch Players */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Players</h2>
        {/* loop over player array */}
        {Array.isArray(players.data)
          ? players.data.map((player: string) => <div key={player}>{player}</div>)
          : "No players yet"}
      </div>

      {/* Fetch Player Score */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Player Score</h2>
        <p>{playerScore.data?.toString() || "No player score yet"}</p>
      </div>
    </div>
  );
};

export default Test;
