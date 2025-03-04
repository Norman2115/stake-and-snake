import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Trophy } from "lucide-react";
import { NextPage } from "next";
import TournamentCard from "~~/components/tournament-card";

const Tournaments: NextPage = () => {
  return (
    <div className="flex flex-grow flex-col bg-gray-900 text-white">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <button>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Tournaments</h1>
        </div>

        {/* <ChainTabs /> */}

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-1 text-2xl font-bold">ETH Weekly Championship</h2>
                <p className="text-gray-300">
                  Join our Ethereum tournament with a massive prize pool. Top players take home the rewards!
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-bold text-blue-500">5.5 ETH</div>
                <div className="text-sm text-gray-400">Prize Pool</div>
                <button className="mt-2 bg-blue-500 hover:bg-blue-600 px-3 py-2 text-sm rounded-md">
                  Register Now
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-1 text-2xl font-bold">VG Weekly Championship</h2>
                <p className="text-gray-300">
                  Compete in our Vanar tournament with exciting rewards. Show your skills and win big!
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-bold text-purple-500">1000 VG</div>
                <div className="text-sm text-gray-400">Prize Pool</div>
                <button className="mt-2 bg-purple-500 hover:bg-purple-600 px-3 py-2 text-sm rounded-md">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Upcoming Tournaments</h2>
          <button className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">
            <Calendar className="mr-2 h-4 w-4" /> Calendar View
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TournamentCard
            name="Weekend Warrior"
            date="Sat, Mar 6"
            time="2:00 PM UTC"
            entryFee="0.1 ETH"
            prizePool="2.5 ETH"
            players={18}
            maxPlayers={32}
            status="registering"
            chainType="scroll"
          />
          <TournamentCard
            name="Beginner's Battle"
            date="Sun, Mar 7"
            time="4:00 PM UTC"
            entryFee="0.05 ETH"
            prizePool="1.2 ETH"
            players={24}
            maxPlayers={24}
            status="full"
            chainType="scroll"
          />
          <TournamentCard
            name="VG Masters"
            date="Fri, Mar 12"
            time="8:00 PM UTC"
            entryFee="50 VG"
            prizePool="1000 VG"
            players={12}
            maxPlayers={20}
            status="registering"
            chainType="vanar"
          />
          <TournamentCard
            name="Midnight Madness"
            date="Wed, Mar 10"
            time="11:00 PM UTC"
            entryFee="20 VG"
            prizePool="400 VG"
            players={8}
            maxPlayers={16}
            status="registering"
            chainType="vanar"
          />
          <TournamentCard
            name="High Stakes Showdown"
            date="Mon, Mar 15"
            time="6:00 PM UTC"
            entryFee="0.3 ETH"
            prizePool="6 ETH"
            players={15}
            maxPlayers={20}
            status="registering"
            chainType="scroll"
          />
          <TournamentCard
            name="VG Quick Play"
            date="Thu, Mar 11"
            time="1:00 PM UTC"
            entryFee="10 VG"
            prizePool="200 VG"
            players={10}
            maxPlayers={20}
            status="registering"
            chainType="vanar"
          />
        </div>
      </main>
    </div>
  );
};

export default Tournaments;
