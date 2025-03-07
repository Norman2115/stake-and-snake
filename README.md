# Stake & Snake

## Description
"My brain is stuck!"

"Boring kills projects"

"2025 is a snake year!"

## Scroll (Scroll Sepolia)
* SnakeFactory
  * Factory contract that deploys contracts to manage Lobby and Tournament Games (Verified).
  * [0xE04aD003257688aF5fbe34f80D26D3e1463Bc41C](https://sepolia.scrollscan.com/address/0xE04aD003257688aF5fbe34f80D26D3e1463Bc41C)
* LobbyGame
  * An example of a LobbyGame contract (Unverified, Child Contract).
  * [0x680BC51c1B35CbA280Ff61a655Db3612BCE45977](https://sepolia.scrollscan.com/address/0x680BC51c1B35CbA280Ff61a655Db3612BCE45977)
* TournamentGame
  * An example of a Tournament contract (Unverified, Child Contract).
  * [0xecEF5Df87D5CA93f2c99F955e0320EF65cf6dC84](https://sepolia.scrollscan.com/address/0xecEF5Df87D5CA93f2c99F955e0320EF65cf6dC84)

## Vanar (Vanguard)
Gaming is one of the Big 5 use cases of Vanar Chain. The fast transactions and fixed low fees aspects of Vanar make it ideal for a gaming platform where players can enjoy without worrying about high gas fees.

* SnakeFactory
  * Factory contract that deploys contracts to manage Lobby and Tournament Games (Verified).
  * [0x9a50e5c1B271CF445764a65a16234C484B335081](https://explorer-vanguard.vanarchain.com/address/0x9a50e5c1B271CF445764a65a16234C484B335081)
* LobbyGame
  * An example of a LobbyGame contract (Unverified, Child Contract).
  * [0xcefd63639860723e4218ae0b819aa989ea86a44e](https://explorer-vanguard.vanarchain.com/address/0xCEFd63639860723E4218AE0B819aA989ea86a44e)
* TournamentGame
  * An example of a Tournament contract (Unverified, Child Contract).
  * [0xa7c03ca17d4a5efa1b7dbd7050ccfffdca5af0fc](https://explorer-vanguard.vanarchain.com/address/0xa7C03Ca17d4A5efA1B7dBD7050CcfffDCa5af0FC)

## The Graph
Our game is fully powered by The Graph, from lobby games and tournament matches to the leaderboard. We store data on-chain for player transparency and use The Graph's subgraph to fetch and organize it efficiently.
* [Here](packages/snake-subgraph-scroll/) is the repository for the subgraph indexing the **Scroll Sepolia** network.
* [Here](packages/snake-graph-vanar/) is the repository for the subgraph indexing the **Vanguard** network.
* TheGraph Endpoint: https://api.studio.thegraph.com/query/104999/snake-subgraph-scroll/version/latest
* For the frontend subgraph integration, we use **Apollo Client** to fetch data from the subgraph. [Here](packages/nextjs/app/lobbies/page.tsx#L16-L77) is an example.

Unfortunately, we couldn't provide the endpoint for the Vanguard subgraph as it is running on our **local Graph Node**. However, here are some screenshots.

### The Subgraph Explorer for Vanguard
![Image](https://github.com/user-attachments/assets/4f3cc951-f8b7-4b02-afbc-30f234479354)

---

### The Graph Node for Vanguard
```
cargo run -p graph-node --release -- \
  --postgres-url postgresql://orman:password@localhost:5432/graph-node \
  --ethereum-rpc mainnet:https://rpc-vanguard.vanarchain.com \
  --ipfs 127.0.0.1:5001
```
![Image](https://github.com/user-attachments/assets/53d92c92-5ebb-4e9c-8424-3a9b43574171)

## Features

## Things to Add

## Special Thanks
