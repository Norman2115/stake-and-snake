import Link from "next/link";
import { Clock, Users } from "lucide-react";

interface LobbyCardProps {
  name: string;
  players: number;
  maxPlayers: number;
  stake: string;
  status: "waiting" | "in-progress";
  timeLeft: string;
  chainType: "scroll" | "vanar";
}

export default function LobbyCard({ name, players, maxPlayers, stake, status, timeLeft, chainType }: LobbyCardProps) {
  const chainColor = chainType === "scroll" ? "bg-blue-500/20 text-blue-500" : "bg-purple-500/20 text-purple-500";

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-green-500/50">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{name}</h3>
        <div
          className={`rounded-full px-2 py-0.5 text-xs ${
            status === "waiting" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
          }`}
        >
          {status === "waiting" ? "Waiting" : "In Progress"}
        </div>
      </div>
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Users className="mr-1 h-4 w-4" />
            Players
          </div>
          <div>
            {players}/{maxPlayers}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            Time Left
          </div>
          <div>{timeLeft}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Stake</div>
          <div className="font-medium text-green-500">{stake}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Chain</div>
          <div className={`font-medium rounded px-1.5 py-0.5 ${chainColor}`}>
            {chainType === "scroll" ? "Scroll" : "Vanar"}
          </div>
        </div>
      </div>
      <Link href={`/game/${name.toLowerCase().replace(/\s+/g, "-")}`}>
        <button className="w-full bg-green-500 hover:bg-green-600 px-3 py-3 rounded-md font-medium text-sm">
          {status === "waiting" ? "Join Game" : "Spectate"}
        </button>
      </Link>
    </div>
  );
}
