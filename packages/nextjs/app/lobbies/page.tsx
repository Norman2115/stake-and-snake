"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { ArrowLeft, Lock, Plus, Search, Users } from "lucide-react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { getChainId } from "wagmi/actions";
import { CreateLobbyModal } from "~~/components/create-lobby-modal";
import LobbyCard from "~~/components/lobby-card";
import LobbyCardTest from "~~/components/lobby-card-test";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

const SCROLL_API_URL = "https://api.studio.thegraph.com/query/104999/snake-subgraph-scroll/version/latest";
const VANAR_API_URL = "http://127.0.0.1:9191/subgraphs/name/snake-subgraph-vanar";

const Lobbies: NextPage = () => {
  const { address: connectedAddress, chainId } = useAccount();
  const [scrollGames, setscrollGames] = useState<any[]>([]);
  const [vanarGames, setVanarGames] = useState<any[]>([]);

  const scrollClient = new ApolloClient({
    uri: SCROLL_API_URL,
    cache: new InMemoryCache(),
  });

  const vanarClient = new ApolloClient({
    uri: VANAR_API_URL,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    const gameQuery = gql`
      query {
        games(where: { ended: false }) {
          id
          address
          creator
          name
          started
          ended
          maxPlayers
          stakeAmount
          duration
          playerAddresses
          numOfPlayers
        }
      }
    `;

    const fetchScrollGames = async () => {
      try {
        const { data } = await scrollClient.query({ query: gameQuery });
        console.log("Scroll subgraph lobby data: ", data);
        setscrollGames(data.games);
      } catch (err) {
        console.log("Error fetching Scroll data: ", err);
      }
    };

    const fetchVanarGames = async () => {
      try {
        const { data } = await vanarClient.query({ query: gameQuery });
        console.log("Vanar subgraph lobby data: ", data);
        setVanarGames(data.games);
      } catch (err) {
        console.log("Error fetching Vanar data: ", err);
      }
    };

    fetchScrollGames();
    fetchVanarGames();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-grow flex-col bg-gray-900 text-white">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <button>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Game Lobbies</h1>
          <div className="ml-auto flex gap-2">
            <CreateLobbyModal />
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search lobbies..."
              className="bg-gray-800 pl-10 text-white placeholder:text-gray-500 flex px-3 py-2 w-full rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button className="border-gray-700 border bg-gray-800 text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm">
              All Stakes
            </button>
            <button className="border-gray-700 border bg-gray-800 text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm">
              Players: Any
            </button>
          </div>
        </div>

        <Tabs defaultValue="public" className="mb-8">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="public" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Users className="mr-2 h-4 w-4" /> Public Lobbies
            </TabsTrigger>
            <TabsTrigger value="private" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Lock className="mr-2 h-4 w-4" /> Private Lobbies
            </TabsTrigger>
          </TabsList>
          <TabsContent value="public" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <LobbyCard
                name="High Rollers"
                players={3}
                maxPlayers={5}
                stake="0.5 ETH"
                status="waiting"
                timeLeft="2:30"
                chainType="scroll"
              />
              <LobbyCard
                name="Beginners Only"
                players={2}
                maxPlayers={4}
                stake="0.01 ETH"
                status="waiting"
                timeLeft="1:45"
                chainType="scroll"
              />
              <LobbyCard
                name="Mid Stakes"
                players={4}
                maxPlayers={4}
                stake="0.1 ETH"
                status="in-progress"
                timeLeft="5:12"
                chainType="scroll"
              />
              <LobbyCard
                name="Snake Masters"
                players={1}
                maxPlayers={3}
                stake="10 VG"
                status="waiting"
                timeLeft="0:30"
                chainType="vanar"
              />
              <LobbyCard
                name="Quick Game"
                players={2}
                maxPlayers={2}
                stake="5 VG"
                status="in-progress"
                timeLeft="3:10"
                chainType="vanar"
              />
              <LobbyCard
                name="Weekend Warriors"
                players={1}
                maxPlayers={6}
                stake="25 VG"
                status="waiting"
                timeLeft="4:00"
                chainType="vanar"
              />
              {/* Real Data Testing */}
              {scrollGames.map(game => (
                <LobbyCardTest
                  key={game.id}
                  id={game.id}
                  address={game.address}
                  name={game.name}
                  maxPlayers={game.maxPlayers}
                  stakeAmount={game.stakeAmount}
                  duration={game.duration}
                  started={game.started}
                  numOfPlayers={game.numOfPlayers}
                  playerAddresses={game.playerAddresses}
                  chainType="scroll"
                />
              ))}
              {vanarGames.map(game => (
                <LobbyCardTest
                  key={game.id}
                  id={game.id}
                  address={game.address}
                  name={game.name}
                  maxPlayers={game.maxPlayers}
                  stakeAmount={game.stakeAmount}
                  duration={game.duration}
                  started={game.started}
                  numOfPlayers={game.numOfPlayers}
                  playerAddresses={game.playerAddresses}
                  chainType="vanar"
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="private" className="mt-6">
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
              <Lock className="mx-auto mb-4 h-12 w-12 text-gray-500" />
              <h3 className="mb-2 text-xl font-medium">Join Private Lobby</h3>
              <p className="mb-4 text-gray-400">Enter a lobby code to join a private game</p>
              <div className="mx-auto flex max-w-md gap-2">
                <input
                  placeholder="Enter lobby code"
                  className="bg-gray-700 text-white flex flex-grow p-3 text-sm rounded-md"
                />
                <button className="bg-green-500 hover:bg-green-600 px-5 py-3 text-sm rounded-md">Join</button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Lobbies;
