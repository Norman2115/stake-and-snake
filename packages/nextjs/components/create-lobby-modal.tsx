"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import abi from "../../snake-subgraph-scroll/abis/SnakeFactory.json";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Switch } from "@radix-ui/react-switch";
import { log } from "console";
import { Copy, Plus } from "lucide-react";
import { formatUnits, parseEther } from "viem";
import { useWatchContractEvent, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import {
  useScaffoldReadContract,
  useScaffoldWatchContractEvent,
  useScaffoldWriteContract,
  useTransactor,
} from "~~/hooks/scaffold-eth";

const APIURL = "https://api.studio.thegraph.com/query/104999/snake-subgraph-scroll/version/latest";

export function CreateLobbyModal() {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lobbyName, setLobbyName] = useState("");
  const [selectedChain, setSelectedChain] = useState<"scroll" | "vanar">("scroll");
  const [stakeAmount, setStakeAmount] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("4");
  const [isPrivate, setIsPrivate] = useState(false);
  const [lobbyCode, setLobbyCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [duration, setDuration] = useState("300");
  const [newGameData, setNewGameData] = useState<{ gameAddress: string } | null>(null);

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  const chainToFactoryMap = {
    scroll: "0xE04aD003257688aF5fbe34f80D26D3e1463Bc41C",
    vanar: "0x9a50e5c1B271CF445764a65a16234C484B335081",
  };

  const fetchNewGameData = async () => {
    const newGameQuery = gql`
    query {
      gameCreateds(
        where: { creator: "${connectedAddress}", ended: false }
        orderBy: blockTimestamp
        orderDirection: desc
        first: 1
      ) {
        id
        gameAddress
        creator
        duration
        stakeAmount
        name
        started
        ended
        maxPlayers
        blockTimestamp
      }
    }
  `;
    client
      .query({ query: newGameQuery })
      .then(({ data }) => {
        console.log("Game data: ", data);
        setNewGameData(data.gameCreateds[0]);
      })
      .catch(err => {
        console.log("Error fetching winner data: ", err);
      });
  };

  // Fetch new game data when a new game is created and the user is connected
  useEffect(() => {
    if (isCreated && connectedAddress) {
      fetchNewGameData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreated, connectedAddress]);

  const generateLobbyCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
  };

  const { writeContractAsync, isPending } = useWriteContract();

  const writeTx = useTransactor();

  const writeContractAsyncCreateLobby = () =>
    writeContractAsync({
      abi: abi,
      address: chainToFactoryMap[selectedChain],
      functionName: "createGame",
      args: [lobbyName, parseEther(stakeAmount), parseInt(maxPlayers), BigInt(parseInt(duration))],
      value: parseEther(stakeAmount),
    });

  // Create a new lobby
  const handleCreateLobby = async () => {
    try {
      setIsCreating(true);
      await writeTx(writeContractAsyncCreateLobby);
      setIsCreating(false);
      setIsCreated(true);
    } catch (error) {
      console.log("Unexpected error in writeTx", error);
    }
  };

  useEffect(() => {
    setLobbyCode(generateLobbyCode());
    if (newGameData && isCreated) {
      setTimeout(() => {
        router.push(`/game/${selectedChain}/${newGameData.gameAddress}`);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newGameData, router, isCreated]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-green-500 hover:bg-green-600 flex p-3 rounded-md text-white text-sm justify-center items-center">
          <Plus className="mr-2 h-4 w-4" /> Create Lobby
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Create New Lobby</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up your game lobby and stake your crypto to play.
          </DialogDescription>
        </DialogHeader>

        {!isCreated ? (
          <div className="grid gap-4 py-4">
            <Tabs
              defaultValue="eth"
              className="w-full"
              onValueChange={value => setSelectedChain(value as "scroll" | "vanar")}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="scroll" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Scroll
                </TabsTrigger>
                <TabsTrigger value="vanar" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  Vanar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scroll" className="mt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="eth-stake" className="text-right text-sm">
                      Stake (ETH)
                    </label>
                    <input
                      id="eth-stake"
                      value={stakeAmount}
                      onChange={e => setStakeAmount(e.target.value)}
                      placeholder="0.1"
                      className="col-span-3 bg-gray-800 border-gray-700 text-sm p-3 rounded-md"
                    />
                  </div>
                  <div className="rounded-md bg-blue-500/10 border border-blue-500/20 p-3">
                    <p className="text-xs text-blue-300">
                      Players will need to stake {stakeAmount || "0.1"} ETH to join this lobby. The winner takes the pot
                      minus platform fees.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vanar" className="mt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="vg-stake" className="text-right text-sm">
                      Stake (VG)
                    </label>
                    <input
                      id="vg-stake"
                      value={stakeAmount}
                      onChange={e => setStakeAmount(e.target.value)}
                      placeholder="10"
                      className="col-span-3 bg-gray-800 border-gray-700 text-sm p-3 rounded-md"
                    />
                  </div>
                  <div className="rounded-md bg-purple-500/10 border border-purple-500/20 p-3">
                    <p className="text-xs text-purple-300">
                      Players will need to stake {stakeAmount || "10"} VG to join this lobby. The winner takes the pot
                      minus platform fees.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm">
                Lobby Name
              </label>
              <input
                id="name"
                value={lobbyName}
                onChange={e => setLobbyName(e.target.value)}
                placeholder="My Snake Game"
                className="col-span-3 bg-gray-800 border-gray-700 p-3 text-sm rounded-md"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="max-players" className="text-right text-sm">
                Max Players
              </label>
              <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select max players" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="3">3 Players</SelectItem>
                  <SelectItem value="4">4 Players</SelectItem>
                  <SelectItem value="5">5 Players</SelectItem>
                  <SelectItem value="6">6 Players</SelectItem>
                  <SelectItem value="6">7 Players</SelectItem>
                  <SelectItem value="6">8 Players</SelectItem>
                  <SelectItem value="6">9 Players</SelectItem>
                  <SelectItem value="6">10 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="max-players" className="text-right text-sm">
                Duration
              </label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select max players" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="60">1 Minute</SelectItem>
                  <SelectItem value="120">2 Minutes</SelectItem>
                  <SelectItem value="180">3 Minutes</SelectItem>
                  <SelectItem value="240">4 Minutes</SelectItem>
                  <SelectItem value="300">5 Minutes</SelectItem>
                  <SelectItem value="360">6 Minutes</SelectItem>
                  <SelectItem value="420">7 Minutes</SelectItem>
                  <SelectItem value="480">8 Minutes</SelectItem>
                  <SelectItem value="540">9 Minutes</SelectItem>
                  <SelectItem value="600">10 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="private" className="text-right text-sm">
                Private Lobby
              </label>
              <div className="flex items-center gap-3 col-span-3">
                <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
                <span className="text-sm text-gray-400">
                  {isPrivate ? "Only players with the code can join" : "Anyone can join this lobby"}
                </span>
              </div>
            </div>

            {isPrivate && lobbyCode && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Lobby Code</label>
                <div className="col-span-3 flex items-center gap-2">
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 flex-1 font-mono">
                    {lobbyCode}
                  </div>
                  <button className="border-gray-700 hover:bg-gray-700" onClick={copyLobbyCode}>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-medium">Lobby Created!</h3>
            <p className="text-gray-400">Your lobby has been created successfully. Redirecting to game...</p>
          </div>
        )}

        <DialogFooter>
          {!isCreated && (
            <>
              <button
                onClick={() => setOpen(false)}
                className="border-gray-700 hover:bg-gray-700 px-3 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLobby}
                disabled={!lobbyName || !stakeAmount || isCreating}
                className={`${
                  selectedChain === "scroll" ? "bg-blue-500 hover:bg-blue-600" : "bg-purple-500 hover:bg-purple-600"
                } px-4 py-2 rounded-md text-sm`}
              >
                {isCreating ? "Creating..." : "Create Lobby"}
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
