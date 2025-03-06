"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import abi from "../../../../snake-graph-scroll/abis/LobbyGame.json";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ArrowLeft, Crown, Hand, Settings, Users } from "lucide-react";
import { formatUnits, parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import GameCanvas from "~~/components/game-canvas";
import PlayerList from "~~/components/player-list";
import { useTransactor } from "~~/hooks/scaffold-eth";

const APIURL = "https://api.studio.thegraph.com/query/104999/snake-graph-scroll/version/latest";

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [game, setGame] = useState<any>(null); // State to store fetched game data
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [potAmount, setPotAmount] = useState("0.75 ETH");
  const [highestScore, setHighestScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);

  const gameQuery = gql`
    query {
      gameCreated(id: "${id}") {
        gameAddress
        maxPlayers
        name
        stakeAmount
        duration
        creator
        started
        ended
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
        console.log(data.gameCreated.stakeAmount);
        setGameStarted(data.gameCreated.started);
      })
      .catch(err => {
        console.log("Error fetching data: ", err);
      });
  }, [gameQuery]);

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

  const { writeContractAsync } = useWriteContract();
  const writeTx = useTransactor();

  const writeContractAsyncStartGame = () =>
    writeContractAsync({
      abi: abi,
      address: game.gameAddress,
      functionName: "startGame",
    });

  const handleStartGame = async () => {
    try {
      await writeTx(writeContractAsyncStartGame);
      setGameStarted(true);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  const writeContractAsyncEndGame = () =>
    writeContractAsync({
      abi: abi,
      address: game.gameAddress,
      functionName: "endGame",
    });

  const handleEndGame = async () => {
    try {
      await writeTx(writeContractAsyncEndGame);
      router.push(`/lobbies`);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  const writeContractAsyncSubmitScore = () =>
    writeContractAsync({
      abi: abi,
      address: game.gameAddress,
      functionName: "submitScore",
      args: [highestScore],
    });

  const handleSubmitScore = async () => {
    try {
      await writeTx(writeContractAsyncSubmitScore);
      setIsScoreSubmitted(true);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  const onGameOver = (score: number) => {
    setCurrentScore(score);
    if (score > highestScore) {
      setHighestScore(score);
    }
  };

  const setGameOverSignal = (value: boolean) => {
    setGameOver(value);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/lobbies">
            <button>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">High Rollers Game</h1>
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
                    <button className="border-gray-700 hover:bg-gray-700 px-4 py-2 rounded-md text-sm">
                      Leave Game
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm"
                      onClick={handleStartGame}
                    >
                      Start Game
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* {timeLeft === 0 && !isScoreSubmitted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="rounded-lg bg-gray-800 p-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-green-500">Game Over!</h2>
                  <p className="mb-4 text-xl">Highest score: {highestScore}</p>
                  <div className="flex justify-center gap-2">
                    <button className="rounded-md bg-gray-500 px-4 py-2 font-medium text-white hover:bg-gray-600">
                      Submit Score
                    </button>
                  </div>
                </div>
              </div>
            )}
            {gameOver && timeLeft !== 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="rounded-lg bg-gray-800 p-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-red-500">Game Over!</h2>
                  <p className="mb-4 text-xl">Your score: {currentScore}</p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-500" />
                <h2 className="text-lg font-medium mb-0">Players</h2>
              </div>
              <PlayerList />
            </div>

            <div className="rounded-lg border border-gray-700  bg-gray-800/50 p-4">
              <div className="mb-4 flex items-center">
                <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-medium mb-0">Game Info</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stake:</span>
                  <span>
                    {" "}
                    {game?.stakeAmount
                      ? (parseFloat(game.stakeAmount) / 10 ** 18).toLocaleString(undefined, {
                          maximumFractionDigits: 5,
                        })
                      : "Loading..."}{" "}
                    ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pot:</span>
                  <span className="text-green-500 font-medium">{potAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Mode:</span>
                  <span>Lobby</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Limit:</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="mb-4 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-medium mb-0">Actions</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <button
                    className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-sm w-full"
                    onClick={handleEndGame}
                  >
                    End Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
