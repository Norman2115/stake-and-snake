"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import abi from "../../../../snake-subgraph-scroll/abis/LobbyGame.json";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ArrowLeft, Crown, Hand, Settings, Users } from "lucide-react";
import { formatUnits, parseEther } from "viem";
import { useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";
import GameCanvas from "~~/components/game-canvas";
import PlayerList from "~~/components/player-list";
import { useTransactor } from "~~/hooks/scaffold-eth";

const APIURL = "https://api.studio.thegraph.com/query/104999/snake-subgraph-scroll/version/latest";

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [game, setGame] = useState<any>(null); // State to store fetched game data
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 3 minutes in seconds
  const [potAmount, setPotAmount] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const [isGameEnded, setIsGameEnded] = useState(false);

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  const fetchGameData = () => {
    const getLobbyGameById = gql`
      query {
        game(id: "${id}") {
          address
          maxPlayers
          name
          stakeAmount
          duration
          creator
          started
          ended
          numOfPlayers
        }
      }
    `;
    client
      .query({ query: getLobbyGameById })
      .then(({ data }) => {
        console.log("Scroll subgraph lobby data: ", data);
        setGame(data.game);
        setTimeLeft(data.game.duration);
        setPotAmount(
          parseFloat(
            (parseFloat(data.game.stakeAmount) / 10 ** 18).toLocaleString(undefined, {
              maximumFractionDigits: 5,
            }),
          ) * data.game.numOfPlayers,
        );
      })
      .catch(err => {
        console.log("Error fetching data: ", err);
      });
  };

  const fetchWinnerData = () => {
    const getGameWinners = gql`
      query {
        gameEndeds(where: {contractAddress: "${id}"}) {
          id
          winners
          highestScore
          prizeShare
        }
      }
    `;
    client
      .query({ query: getGameWinners })
      .then(({ data }) => {
        console.log("Winner data: ", data);
        setWinnerData(data.gameEndeds[0]);
      })
      .catch(err => {
        console.log("Error fetching winner data: ", err);
      });
  };

  useEffect(() => {
    if (isGameEnded) {
      fetchWinnerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameEnded]);

  useEffect(() => {
    fetchGameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      address: game.address,
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
      address: game.address,
      functionName: "endGame",
    });

  const handleEndGame = async () => {
    try {
      await writeTx(writeContractAsyncEndGame);
      setIsGameEnded(true);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  const writeContractAsyncSubmitScore = () =>
    writeContractAsync({
      abi: abi,
      address: game.address,
      functionName: "submitScore",
      args: [highestScore],
    });

  const handleSubmitScore = async () => {
    try {
      await writeTx(writeContractAsyncSubmitScore);
      setIsScoreSubmitted(true);
      console.log("Score submitted: ", highestScore);
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

  const handleLeaveGame = () => {
    router.push(`/lobbies`);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
            <GameCanvas gameStarted={gameStarted} onGameOver={onGameOver} timeLeft={timeLeft} />
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
                  <span className="text-green-500 font-medium">{potAmount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Mode:</span>
                  <span>Lobby</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Limit:</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Highest Score:</span>
                  <span>{highestScore}</span>
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
                    onClick={handleStartGame}
                  >
                    Start Game
                  </button>
                </div>
                <div className="flex">
                  <button
                    className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-sm w-full"
                    onClick={handleSubmitScore}
                  >
                    Submit Score
                  </button>
                </div>
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
            {isGameEnded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="rounded-lg bg-gray-900 p-6 text-center max-w-xs w-full">
                  <h2 className="mb-3 text-xl font-bold">Winner</h2>
                  <div className="flex flex-col justify-center gap-2">
                    {Array.isArray(winnerData?.winners) &&
                      winnerData?.winners.map((winner: any) => (
                        <div key={winner} className="flex justify-between mb-3">
                          <div>{formatAddress(winner)}</div>
                          <div>
                            {(parseFloat(game.stakeAmount) / 10 ** 18).toLocaleString(undefined, {
                              maximumFractionDigits: 5,
                            })}{" "}
                            ETH
                          </div>
                        </div>
                      ))}
                    <button
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm"
                      onClick={handleLeaveGame}
                    >
                      Leave Game
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
