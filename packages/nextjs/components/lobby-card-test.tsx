"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Users } from "lucide-react";
import { parseEther } from "viem";
import { formatUnits } from "viem";
import { useAccount, useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";
// import abi from "../../snake-graph-scroll/abis/LobbyGame.json";
import abi from "~~/abi/LobbyGame.json";
import { useTransactor } from "~~/hooks/scaffold-eth";

interface LobbyCardProps {
  id: string;
  name: string;
  address: string;
  maxPlayers: number;
  stakeAmount: string;
  duration: number;
  chainType: "scroll" | "vanar";
}

export default function LobbyCardTest({
  id,
  name,
  address,
  maxPlayers,
  stakeAmount,
  duration,
  chainType,
}: LobbyCardProps) {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();

  // Watch Contract Events
  const [eventData, setEventData] = useState<any>(null);
  useWatchContractEvent({
    abi: abi,
    address: address,
    eventName: "playerJoined",
    onLogs: logs => {
      console.log("GameStarted event logs: ", logs);
      setEventData(logs);
    },
  });

  // Fetch game status from the contract
  const {
    data: isGameStarted,
    isLoading: gameStatusLoading,
    error: gameStatusError,
  } = useReadContract({
    abi: abi,
    address: address,
    functionName: "isGameStarted",
  });

  // Fetch prize pool from the contract
  const {
    data: prizePool,
    isLoading: prizePoolLoading,
    error: prizePoolError,
  } = useReadContract({
    abi: abi,
    address: address,
    functionName: "getPrizePool",
  });

  // Fetch players from the contract
  const {
    data: players,
    isLoading: playersLoading,
    error: playersError,
  } = useReadContract({
    abi: abi,
    address: address,
    functionName: "getPlayers",
  });

  // Fetch game ended status from the contract
  const {
    data: isGameEnded,
    isLoading: isGameEndedLoading,
    error: isGameEndedError,
  } = useReadContract({
    abi: abi,
    address: address,
    functionName: "isGameEnded",
  });

  const { writeContractAsync, isPending } = useWriteContract();
  const writeTx = useTransactor();

  const writeContractAsyncJoinGame = () =>
    writeContractAsync({
      abi: abi,
      address: address,
      functionName: "joinGame",
      value: parseEther(formatUnits(BigInt(stakeAmount), 18)),
    });

  const handleJoinGame = async () => {
    if (isGameStarted === true) {
      return;
    }

    if (Array.isArray(players) && players.includes(connectedAddress)) {
      router.push(`/game/${id}`);
      return;
    }

    try {
      await writeTx(writeContractAsyncJoinGame, { blockConfirmations: 1 });
      router.push(`/game/${id}`);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  const chainColor = chainType === "scroll" ? "bg-blue-500/20 text-blue-500" : "bg-purple-500/20 text-purple-500";

  if (playersLoading || gameStatusLoading || prizePoolLoading || isGameEndedLoading) {
    return <></>;
  }

  if (playersError || gameStatusError || prizePoolError || isGameEndedError) {
    return <div>Error loading data</div>;
  }

  if (isGameEnded) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-green-500/50">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{name}</h3>
        <div
          className={`rounded-full px-2 py-0.5 text-xs ${
            isGameStarted === false ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
          }`}
        >
          {isGameStarted === false ? "Waiting" : "In Progress"}
        </div>
      </div>
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Users className="mr-1 h-4 w-4" />
            Players
          </div>
          <div>
            {Array.isArray(players) ? players.length : 0}/{maxPlayers}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            Time Left
          </div>
          <div>{(duration / 60).toFixed(0)}:00</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Stake</div>
          <div className={`font-medium rounded px-1.5 py-0.5 ${chainColor}`}>
            {(parseFloat(stakeAmount) / 10 ** 18).toLocaleString(undefined, { maximumFractionDigits: 5 })}{" "}
            {chainType === "scroll" ? "ETH" : "VG"}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Chain</div>
          <div className={`font-medium rounded px-1.5 py-0.5 ${chainColor}`}>
            {chainType === "scroll" ? "Scroll" : "Vanar"}
          </div>
        </div>
      </div>
      <button
        className={`w-full bg-green-500 hover:bg-green-600 px-3 py-3 rounded-md font-medium text-sm ${
          isGameStarted === false ? "cursor-pointer" : "cursor-not-allowed bg-gray-500"
        }`}
        onClick={handleJoinGame}
      >
        {isGameStarted === false ? "Join Game" : "On Going"}
      </button>
    </div>
  );
}
