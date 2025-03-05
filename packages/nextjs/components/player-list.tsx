export default function PlayerList() {
  const players = [
    { name: "CryptoKing", score: 145, color: "#55efc4" },
    { name: "SnakeMaster99", score: 132, color: "#ffeaa7" },
    { name: "ETHSnake", score: 98, color: "#fab1a0" },
    { name: "BlockchainGamer", score: 87, color: "#81ecec" },
    { name: "CryptoQueen", score: 76, color: "#a29bfe" },
  ];

  return (
    <div className="space-y-3">
      {players.map((player, index) => (
        <div key={index} className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium"
            style={{ backgroundColor: player.color }}
          >
            {player.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate font-medium">{player.name}</div>
          </div>
          <div className="text-sm font-medium">{player.score}</div>
        </div>
      ))}
    </div>
  );
}
