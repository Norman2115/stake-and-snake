# Stake & Snake

## Description
"My brain is stuck!"

"I want to make something fun"

"2025 is a snake year!"

Oh, the Nokia 3310 OG Snake game? Yep, that’s how we got here. We aim to solve the problem where many Web3 games are overly focused on blockchain incentives and have complex UIs. As a newcomer myself, it can be quite difficult for us who are just trying to explore around. Our focus is on making the experience simple, fun, and user-friendly at a glance.

Stake & Snake is a Web3 snake game that merges the nostalgia of the classic Snake with blockchain staking. Snake game, but at Web 3, with staking. Players can stake and compete, with first place taking all in public/private lobbies, while tournaments reward the top 10 ranked players on the podium, with higher ranks earning a bigger cut. A 5%–10% fee is taken from the prize pools to keep the platform running and cover gas fees for automated operations.

🚨 Disclaimer 🚨

The game is a prototype. If you spot any mathematical miscalculations... Just pretend it’s abstract art and move on.

If you're looking for features and pages, [here](https://github.com/Norman2115/stake-and-snake/blob/main/README.md#features) they are.

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

We decided to make it cross-chain, with a single subgraph querying each chain. Unfortunately, we couldn't provide the endpoint for the Vanguard subgraph as it is running on our **local Graph Node**. However, here are some screenshots.

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
### Choose Your Game Mode
* You can choose between a casual lobby or competitive tournaments.

![Image](https://github.com/user-attachments/assets/bc27d09f-42eb-4be0-98c7-d606212e415c)

---

### Create Your Lobby Game
* You can create your own lobbies or join games hosted by others!
* Select your preferred stake amount and duration.

![Image](https://github.com/user-attachments/assets/ac053550-7020-48f6-b9a5-0006e2fdc022)

![Image](https://github.com/user-attachments/assets/16fd76c9-d803-4cfd-b58c-d939b4d7a170)

* You can also create private lobbies and enjoy games with your friends without any interruptions.

![Image](https://github.com/user-attachments/assets/99fdbcd3-dc37-4def-9f73-a032c13ae746)

---

### Compete with Others

* Time to compete with others! Get the best score within the time limit.
* You can play again and keep beating your high score until the timer runs out.
* The startGame, submitScore, and endGame operations are handled by the platform, but for demonstration purposes, we executed them manually.

![Image](https://github.com/user-attachments/assets/a35268dd-c328-4ed9-a1cd-4eb23e33415c)

---

### Register for Tournaments

* If you’re looking for a more competitive and higher-stakes experience, sign up for our weekly tournaments!

![Image](https://github.com/user-attachments/assets/a414aebe-0804-4c0c-a275-217c0ef6109f)

---

### Fight for Podium

* Finally, make it to the podium and earn your prizes.

![Image](https://github.com/user-attachments/assets/8ebbdeae-bb0b-4267-a90b-4154993f3096)

---

## Things to Add

## Special Thanks
