import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpDown, Calendar, Crown, Medal, Trophy } from "lucide-react";
import { NextPage } from "next";

const Leaderboard: NextPage = () => {
  return (
    <div className="flex  flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <button>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6">
            <Crown className="mb-2 h-10 w-10 text-yellow-500" />
            <div className="mb-1 text-lg font-medium">Top Player</div>
            <div className="mb-1 text-2xl font-bold">CryptoKing</div>
            <div className="text-yellow-500">5,432 points</div>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <Medal className="mb-2 h-10 w-10 text-gray-400" />
            <div className="mb-1 text-lg font-medium">2nd Place</div>
            <div className="mb-1 text-2xl font-bold">SnakeMaster99</div>
            <div className="text-gray-400">4,987 points</div>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-amber-700/30 bg-amber-700/10 p-6">
            <Trophy className="mb-2 h-10 w-10 text-amber-700" />
            <div className="mb-1 text-lg font-medium">3rd Place</div>
            <div className="mb-1 text-2xl font-bold">ETHSnake</div>
            <div className="text-amber-700">4,756 points</div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Global Rankings</h2>
          <div className="flex gap-2">
            <button className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">This Week</button>
            <button className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">All Time</button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Player</th>
                <th className="p-4 text-left">
                  <div className="flex items-center">
                    Score <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th className="p-4 text-left">
                  <div className="flex items-center">
                    Earnings <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th className="p-4 text-left">Games Played</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700 bg-yellow-500/10">
                <td className="p-4 font-medium">1</td>
                <td className="p-4">CryptoKing</td>
                <td className="p-4 font-medium">5,432</td>
                <td className="p-4 text-green-500">12.5 ETH</td>
                <td className="p-4">42</td>
              </tr>
              <tr className="border-b border-gray-700 bg-gray-700/10">
                <td className="p-4 font-medium">2</td>
                <td className="p-4">SnakeMaster99</td>
                <td className="p-4 font-medium">4,987</td>
                <td className="p-4 text-green-500">10.2 ETH</td>
                <td className="p-4">38</td>
              </tr>
              <tr className="border-b border-gray-700 bg-amber-700/10">
                <td className="p-4 font-medium">3</td>
                <td className="p-4">ETHSnake</td>
                <td className="p-4 font-medium">4,756</td>
                <td className="p-4 text-green-500">8.7 ETH</td>
                <td className="p-4">35</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium">4</td>
                <td className="p-4">BlockchainGamer</td>
                <td className="p-4 font-medium">4,321</td>
                <td className="p-4 text-green-500">7.5 ETH</td>
                <td className="p-4">31</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium">5</td>
                <td className="p-4">CryptoQueen</td>
                <td className="p-4 font-medium">4,112</td>
                <td className="p-4 text-green-500">6.8 ETH</td>
                <td className="p-4">29</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium">6</td>
                <td className="p-4">Web3Snake</td>
                <td className="p-4 font-medium">3,987</td>
                <td className="p-4 text-green-500">5.9 ETH</td>
                <td className="p-4">27</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium">7</td>
                <td className="p-4">ETHGamer</td>
                <td className="p-4 font-medium">3,754</td>
                <td className="p-4 text-green-500">5.2 ETH</td>
                <td className="p-4">25</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium">8</td>
                <td className="p-4">SnakeCharmer</td>
                <td className="p-4 font-medium">3,621</td>
                <td className="p-4 text-green-500">4.8 ETH</td>
                <td className="p-4">23</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium">9</td>
                <td className="p-4">CryptoNinja</td>
                <td className="p-4 font-medium">3,512</td>
                <td className="p-4 text-green-500">4.3 ETH</td>
                <td className="p-4">21</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">10</td>
                <td className="p-4">BlockSnake</td>
                <td className="p-4 font-medium">3,298</td>
                <td className="p-4 text-green-500">3.9 ETH</td>
                <td className="p-4">19</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
