"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import abi from "../../../../snake-graph-scroll/abis/LobbyGame.json";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ArrowLeft, Crown, Users } from "lucide-react";
import { formatUnits, parseEther } from "viem";
import { useWriteContract } from "wagmi";
import GameCanvas from "~~/components/game-canvas";
import PlayerList from "~~/components/player-list";
import { useTransactor } from "~~/hooks/scaffold-eth";

const APIURL = "https://api.studio.thegraph.com/query/104999/snake-graph-scroll/version/latest";

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [game, setGame] = useState<any>(null); // State to store fetched game data

  const gameQuery = gql`
    query {
      gameCreated(id: "${id}") {
        gameAddress
        maxPlayers
        name
        stakeAmount
        duration
        creator
      }
    }
  `;

  useEffect(() => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    client
      .query({ query: gameQuery })
      .then(({ data }) => {
        console.log("Scroll subgraph lobby data: ", data);
        setGame(data.gameCreated);
      })
      .catch(err => {
        console.log("Error fetching data: ", err);
      });
  }, [gameQuery]);

  const { writeContractAsync } = useWriteContract();
  const writeTx = useTransactor();

  const writeContractAsyncJoinGame = () =>
    writeContractAsync({
      abi: abi,
      address: game.gameAddress,
      functionName: "endGame",
    });

  const handleEndGame = async () => {
    try {
      await writeTx(writeContractAsyncJoinGame);
      router.push(`/lobbies`);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [potAmount, setPotAmount] = useState("0.75 ETH");

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/lobbies">
            <button>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">High Rollers Game</h1>

          <button
            className="ml-auto text-sm px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 cursor-pointer"
            onClick={handleEndGame}
          >
            End Game
          </button>
        </div>

        <div className="grid flex-1 gap-6 md:grid-cols-[1fr_300px]">
          <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <GameCanvas gameStarted={gameStarted} />
            {!gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-lg bg-gray-900/80 p-6 text-center">
                  <h2 className="mb-2 text-xl font-bold">Waiting for players...</h2>
                  <p className="mb-4 text-gray-400">Game will start soon</p>
                  <div className="flex justify-center gap-2">
                    <button className="border-gray-700 hover:bg-gray-700">Leave Game</button>
                    <button className="bg-green-500 hover:bg-green-600" onClick={handleStartGame}>
                      Start Game
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-500" />
                <h2 className="text-lg font-medium">Players</h2>
              </div>
              <PlayerList />
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="mb-4 flex items-center">
                <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-medium">Game Info</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stake:</span>
                  <span>0.15 ETH per player</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pot:</span>
                  <span className="text-green-500 font-medium">{potAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Mode:</span>
                  <span>Classic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Limit:</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
