"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import abi from "../../snake-subgraph-scroll/abis/LobbyGame.json";
import { Clock, Logs, Users } from "lucide-react";
import { start } from "repl";
import { parseEther } from "viem";
import { formatUnits } from "viem";
import { useAccount, useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";

interface LobbyCardProps {
  id: string;
  name: string;
  address: string;
  maxPlayers: number;
  stakeAmount: string;
  duration: number;
  started: boolean;
  playerAddresses: string[];
  numOfPlayers: number;
  chainType: "scroll" | "vanar";
}

export default function LobbyCardTest({
  id,
  name,
  address,
  maxPlayers,
  stakeAmount,
  duration,
  started,
  playerAddresses,
  numOfPlayers,
  chainType,
}: LobbyCardProps) {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();

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
    if (started === true) {
      return;
    }

    console.log("Connected Address: ", connectedAddress);
    console.log("Player Addresses: ", playerAddresses[0]);

    if (connectedAddress && playerAddresses.map(addr => addr.toLowerCase()).includes(connectedAddress.toLowerCase())) {
      router.push(`/game/${chainType}/${id}`);
      return;
    }

    try {
      await writeTx(writeContractAsyncJoinGame);
      router.push(`/game/${chainType}/${id}`);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  const chainColor = chainType === "scroll" ? "bg-blue-500/20 text-blue-500" : "bg-purple-500/20 text-purple-500";

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-green-500/50">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{name}</h3>
        <div
          className={`rounded-full px-2 py-0.5 text-xs ${
            started === false ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
          }`}
        >
          {started === false ? "Waiting" : "In Progress"}
        </div>
      </div>
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Users className="mr-1 h-4 w-4" />
            Players
          </div>
          <div>
            {numOfPlayers}/{maxPlayers}
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
          started === false ? "cursor-pointer" : "cursor-not-allowed bg-gray-500"
        }`}
        onClick={handleJoinGame}
      >
        {started === false ? "Join Game" : "On Going"}
      </button>
    </div>
  );
}
