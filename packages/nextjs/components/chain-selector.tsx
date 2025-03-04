"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";

type Chain = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export function ChainSelector() {
  const chains: Chain[] = [
    {
      id: "eth",
      name: "Ethereum",
      icon: "🔷",
      color: "bg-blue-500",
    },
    {
      id: "vg",
      name: "VG Chain",
      icon: "🟣",
      color: "bg-purple-500",
    },
  ];

  const [selectedChain, setSelectedChain] = useState<Chain>(chains[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 border-gray-700 border bg-gray-800 text-sm px-3 py-2 rounded-md">
          <div className={`h-3 w-3 rounded-full ${selectedChain.color}`}></div>
          {selectedChain.name}
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-gray-800 border-gray-700">
        {chains.map(chain => (
          <DropdownMenuItem
            key={chain.id}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
            onClick={() => setSelectedChain(chain)}
          >
            <div className={`h-3 w-3 rounded-full ${chain.color}`}></div>
            <span>{chain.name}</span>
            {selectedChain.id === chain.id && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
