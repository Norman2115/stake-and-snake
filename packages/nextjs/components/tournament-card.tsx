import { Calendar, Clock, Trophy, Users } from "lucide-react";

interface TournamentCardProps {
  name: string;
  date: string;
  time: string;
  entryFee: string;
  prizePool: string;
  players: number;
  maxPlayers: number;
  status: "registering" | "full" | "in-progress" | "completed";
  chainType: "scroll" | "vanar";
}

export default function TournamentCard({
  name,
  date,
  time,
  entryFee,
  prizePool,
  players,
  maxPlayers,
  status,
  chainType,
}: TournamentCardProps) {
  const chainColor = chainType === "scroll" ? "bg-blue-500/20 text-blue-500" : "bg-purple-500/20 text-purple-500";

  const buttonColor = chainType === "scroll" ? "bg-blue-500 hover:bg-blue-600" : "bg-purple-500 hover:bg-purple-600";

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-green-500/50">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{name}</h3>
        <div
          className={`rounded-full px-2 py-0.5 text-xs ${
            status === "registering"
              ? "bg-green-500/20 text-green-500"
              : status === "full"
                ? "bg-yellow-500/20 text-yellow-500"
                : status === "in-progress"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {status === "registering"
            ? "Registering"
            : status === "full"
              ? "Full"
              : status === "in-progress"
                ? "In Progress"
                : "Completed"}
        </div>
      </div>
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Calendar className="mr-1 h-4 w-4" />
            Date
          </div>
          <div>{date}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            Time
          </div>
          <div>{time}</div>
        </div>
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
          <div className="text-gray-400">Entry Fee</div>
          <div className={`font-medium rounded px-1.5 py-0.5 ${chainColor}`}>{entryFee}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Trophy className="mr-1 h-4 w-4" />
            Prize Pool
          </div>
          <div className={`font-medium rounded px-1.5 py-0.5 ${chainColor}`}>{prizePool}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-400">Chain</div>
          <div className={`font-medium rounded px-1.5 py-0.5 ${chainColor}`}>
            {chainType === "scroll" ? "Scroll" : "Vanar"}
          </div>
        </div>
      </div>
      <button
        className={`w-full px-3 py-3 rounded-md text-sm ${status === "registering" ? buttonColor : "bg-gray-700 text-gray-300 cursor-not-allowed"}`}
        disabled={status !== "registering"}
      >
        {status === "registering" ? "Register Now" : "Registration Closed"}
      </button>
    </div>
  );
}
