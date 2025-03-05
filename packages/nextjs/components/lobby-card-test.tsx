// import Link from "next/link";
// import abi from "../../snake-graph-scroll/abis/LobbyGame.json";
// import { Clock, Users } from "lucide-react";
// import { useReadContract } from "wagmi";

// interface LobbyCardProps {
//   name: string;
//   address: string;
//   maxPlayers: number;
//   stakeAmount: string;
//   duration: number;
//   chainType: "scroll" | "vanar";
// }

// export default function LobbyCardTest({ name, address, maxPlayers, stakeAmount, duration, chainType }: LobbyCardProps) {
//   // Fetch players from the contract
//   const {
//     data: players,
//     isLoading: playersLoading,
//     error: playersError,
//   } = useReadContract({
//     abi: abi,
//     address: address,
//     functionName: "getPlayers",
//   });

//   // Fetch game status from the contract
//   const {
//     data: isGameStarted,
//     isLoading: gameStatusLoading,
//     error: gameStatusError,
//   } = useReadContract({
//     abi: abi,
//     address: address,
//     functionName: "isGameStarted",
//   });

//   // Fetch prize pool from the contract
//   const {
//     data: prizePool,
//     isLoading: prizePoolLoading,
//     error: prizePoolError,
//   } = useReadContract({
//     abi: abi,
//     address: address,
//     functionName: "getPrizePool",
//   });

//   const chainColor = chainType === "scroll" ? "bg-blue-500/20 text-blue-500" : "bg-purple-500/20 text-purple-500";

//   if (playersLoading || gameStatusLoading || prizePoolLoading) {
//     return <div>Loading...</div>;
//   }

//   if (playersError || gameStatusError || prizePoolError) {
//     return <div>Error loading data</div>;
//   }

//   return (
//     <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-green-500/50">
//       <div className="mb-2 flex items-center justify-between">
//         <h3 className="font-medium">{name}</h3>
//         <div
//           className={`rounded-full px-2 py-0.5 text-xs ${
//             isGameStarted === false ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
//           }`}
//         >
//           {isGameStarted === false ? "Waiting" : "In Progress"}
//         </div>
//       </div>
//       <div className="mb-4 space-y-2 text-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center text-gray-400">
//             <Users className="mr-1 h-4 w-4" />
//             Players
//           </div>
//           <div>
//             {Array.isArray(players) ? players.length : 0}/{maxPlayers}
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center text-gray-400">
//             <Clock className="mr-1 h-4 w-4" />
//             Time Left
//           </div>
//           <div>{(duration / 60).toFixed(0)}:00</div>
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="text-gray-400">Stake</div>
//           <div className="font-medium text-green-500">{stakeAmount}</div>
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="text-gray-400">Chain</div>
//           <div className={`font-medium rounded px-1.5 py-0.5 ${chainColor}`}>
//             {chainType === "scroll" ? "Scroll" : "Vanar"}
//           </div>
//         </div>
//       </div>
//       <Link href={`/game/${name.toLowerCase().replace(/\s+/g, "-")}`}>
//         <button
//           className={`w-full bg-green-500 hover:bg-green-600 px-3 py-3 rounded-md font-medium text-sm ${
//             isGameStarted === false ? "cursor-pointer" : "cursor-not-allowed bg-gray-500"
//           }`}
//         >
//           {isGameStarted === false ? "Join Game" : "On Going"}
//         </button>
//       </Link>
//     </div>
//   );
// }
