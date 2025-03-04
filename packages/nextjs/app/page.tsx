"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Users } from "lucide-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-grow flex-col bg-gray-900 text-white">
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            <span className="text-green-500">Stake</span> & <span className="text-green-500">Play</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Compete in multiplayer snake battles, stake ETH or VG, and win big in private lobbies or weekly tournaments.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <Link href="/lobbies" className="group">
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-green-500/50 hover:bg-gray-800">
              <Users className="mb-4 h-12 w-12 text-green-500" />
              <h2 className="mb-2 text-2xl font-bold">Join a Lobby</h2>
              <p className="mb-4 text-center text-gray-400">
                Find public games or join private lobbies with your friends
              </p>
              <button className="group-hover:text-green-500 flex items-center">
                Browse Lobbies <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </Link>

          <Link href="/tournaments" className="group">
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-green-500/50 hover:bg-gray-800">
              <Trophy className="mb-4 h-12 w-12 text-green-500" />
              <h2 className="mb-2 text-2xl font-bold">Weekly Tournaments</h2>
              <p className="mb-4 text-center text-gray-400">
                Compete for massive prize pools in our official tournaments
              </p>
              <button className="group-hover:text-green-500 flex items-center">
                View Tournaments <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <h2 className="mb-4 text-2xl font-bold">Create Your Own Game</h2>
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white">Create Lobby</button>
        </div>
      </main>
      {/* <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        <p>© 2025 CryptoSnake. All game data indexed by The Graph for transparency.</p>
      </footer> */}
    </div>
  );
};

export default Home;
