// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// packages/foundry/contracts/LobbyGame.sol

contract LobbyGame {
    address public creator;
    string public name;
    uint256 public stakeAmount;
    uint8 public maxPlayers;
    uint256 public duration;
    address payable[] public players;
    uint256 public startTime;
    bool public gameEnded;
    uint256 public prizePool;
    bool gameStarted = false;

    mapping(address => uint256) public scores;
    mapping(address => bool) public hasSubmittedScore;
    mapping(address => bool) public isPlayer; // Track registered players
    address[] public winners; // Store winners after game ends

    constructor(
        address _creator,
        string memory _name,
        uint256 _stakeAmount,
        uint8 _maxPlayers,
        uint256 _duration
    ) payable {
        require(msg.value == _stakeAmount, "Stake amount mismatch");
        creator = _creator;
        name = _name;
        stakeAmount = _stakeAmount;
        maxPlayers = _maxPlayers;
        duration = _duration;
        gameEnded = false;
        prizePool = _stakeAmount;

        players.push(payable(_creator));
        isPlayer[_creator] = true; // Mark creator as registered
    }

    //events
    event PlayerJoined(
        address indexed player,
        address indexed contractAddress,
        uint256 stakeAmount,
        uint256 newPrizePool
    );
    event PlayerQuit(
        address indexed player,
        address indexed contractAddress,
        uint256 refundAmount,
        uint256 newPrizePool
    );
    event GameStarted(address contractAddress, uint256 startTime);
    event ScoreSubmitted(
        address indexed player,
        address indexed contractAddress,
        uint256 score
    );
    event GameEnded(
        address contractAddress,
        address[] winners,
        uint256 highestScore,
        uint256 prizeShare,
        uint256 creatorFee
    );

    modifier onlyCreator() {
        require(
            msg.sender == creator,
            "Only the game creator can start the game."
        );
        _;
    }

    function joinGame() external payable {
        require(players.length < maxPlayers, "Lobby is full");
        require(msg.value == stakeAmount, "Incorrect stake amount");
        require(!isPlayer[msg.sender], "Player already joined"); // Prevent duplicate registration

        players.push(payable(msg.sender));
        isPlayer[msg.sender] = true; // Mark as registered
        prizePool += msg.value;

        emit PlayerJoined(msg.sender, address(this), msg.value, prizePool);
    }

    function startGame() external onlyCreator {
        gameStarted = true;
        startTime = block.timestamp;
        emit GameStarted(address(this), startTime);
    }

    function quitGame() external {
        require(!gameStarted, "Game has already started.");
        require(isPlayer[msg.sender], "You are not part of this game.");

        // Refund the player's stake
        uint256 refundAmount = stakeAmount;
        payable(msg.sender).transfer(refundAmount);
        // Find and remove the player from the array
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                players.pop();
                players[i] = players[players.length - 1];

                break;
            }
        }
        isPlayer[msg.sender] = false; // Mark as unregistered
        prizePool -= refundAmount;
        emit PlayerQuit(msg.sender, address(this), refundAmount, prizePool);
    }

    function submitScore(uint256 score) external {
        require(isPlayer[msg.sender], "Not a registered player"); // Ensure only registered players can submit scores
        require(!hasSubmittedScore[msg.sender], "Score already submitted");
        require(gameStarted == true, "The game has not started");

        scores[msg.sender] = score;
        hasSubmittedScore[msg.sender] = true;
        emit ScoreSubmitted(msg.sender, address(this), score);
    }

    function endGame() external {
        require(players.length > 0, "No players in game");
        require(!gameEnded, "Game already ended");

        gameEnded = true;
        uint256 highestScore = 0;

        // Determine the highest score
        for (uint256 i = 0; i < players.length; i++) {
            if (scores[players[i]] > highestScore) {
                highestScore = scores[players[i]];
            }
        }

        uint256 winnerCount = 0;
        for (uint256 i = 0; i < players.length; i++) {
            if (scores[players[i]] == highestScore) {
                winners.push(players[i]);
                winnerCount++;
            }
        }

        require(winnerCount > 0, "No scores submitted");
        require(
            address(this).balance == prizePool,
            "Insufficient contract balance"
        );
        // **Step 1: Deduct 10% for the creator**
        uint256 creatorFee = (prizePool * 10) / 100; // 10% of the total prize pool
        prizePool -= creatorFee; // Remaining amount for winners

        address platform = 0x1f497Ca741399409b399eb540ae2f1D9eC6b89d5;

        // Transfer 10% to the creator
        payable(platform).transfer(creatorFee);
        //this is just for the demo the actual one is where the platform address will be here

        // Distribute the prize
        uint256 prizeShare = prizePool / winnerCount;
        for (uint256 i = 0; i < winnerCount; i++) {
            payable(winners[i]).transfer(prizeShare);
        }
        emit GameEnded(
            address(this),
            winners,
            highestScore,
            prizeShare,
            creatorFee
        );
    }

    function getPlayers() external view returns (address payable[] memory) {
        return players;
    }

    function getPlayerScore(address player) external view returns (uint256) {
        return scores[player];
    }

    function hasPlayerSubmittedScore(
        address player
    ) external view returns (bool) {
        return hasSubmittedScore[player];
    }

    function getPrizePool() external view returns (uint256) {
        return prizePool;
    }

    function getWinners() external view returns (address[] memory) {
        require(gameEnded, "Game has not ended yet");
        return winners;
    }

    function getDuration() external view returns (uint256) {
        return duration;
    }

    function isGameStarted() external view returns (bool) {
        return gameStarted;
    }

    function getGameName() external view returns (string memory) {
        return name;
    }

    function getStakeAmount() external view returns (uint256) {
        return stakeAmount;
    }

    function isGameEnded() external view returns (bool) {
        return gameEnded;
    }
}

// packages/foundry/contracts/TournamentGame.sol

//Tournament game contract
contract TournamentGame {
    address creator;
    string name;
    uint256 startTime;
    uint256 duration;
    uint256 endTime;
    uint256 entryFee;
    uint256 maxPlayers;
    uint256 prizePool;
    bool isWeekly = false;
    address payable[] players;
    bool gameEnded;
    bool gameStarted;
    address[] public winners;

    mapping(address => uint256) scores;
    mapping(address => bool) hasSubmittedScore;
    mapping(address => bool) isPlayer;

    event TPlayerJoined(
        address indexed player,
        address indexed contractAddress,
        uint256 entryFee
    );
    event TScoreSubmitted(
        address indexed player,
        address indexed contractAddress,
        uint256 score
    );
    event TGameEnded(
        address indexed contractAddress,
        address[] indexed players,
        uint256 highestScore,
        uint256 prizeShare,
        uint256 creatorFee
    );

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can perform this action.");
        _;
    }

    constructor(
        address _creator,
        string memory _name,
        uint256 _duration,
        uint256 _entryFee,
        uint256 _maxPlayers,
        bool _isWeekly
    ) payable {
        creator = _creator;
        name = _name;
        startTime = block.timestamp;
        duration = _duration;
        endTime = startTime + _duration;
        entryFee = _entryFee; //1000000000000000000
        maxPlayers = _maxPlayers;
        isWeekly = _isWeekly;
        prizePool = 0;
        gameStarted = true;
    }

    function joinTournament() external payable {
        require(players.length < maxPlayers, "Lobby is full");
        require(msg.value == entryFee, "Incorrect fee amount");
        require(!isPlayer[msg.sender], "Player already joined"); // Prevent duplicate registration

        players.push(payable(msg.sender));
        isPlayer[msg.sender] = true; // Mark as registered
        prizePool += msg.value;

        emit TPlayerJoined(msg.sender, address(this), msg.value);
    }

    function submitScore(uint256 score) external {
        require(isPlayer[msg.sender], "Not a registered player"); // Ensure only registered players can submit scores
        require(!hasSubmittedScore[msg.sender], "Score already submitted");
        require(gameStarted == true, "The game has not started");

        scores[msg.sender] = score;
        hasSubmittedScore[msg.sender] = true;
        emit TScoreSubmitted(msg.sender, address(this), score);
    }

    function endTournament() external onlyCreator {
        require(!gameEnded, "Game already ended"); // Prevent multiple endings
        //   require((block.timestamp >= endTime), "You have to wait till the end of the tournament ");
        gameEnded = true;
        uint256 highestScore = 0;

        // Determine the highest score
        for (uint256 i = 0; i < players.length; i++) {
            if (scores[players[i]] > highestScore) {
                highestScore = scores[players[i]];
            }
        }

        uint256 winnerCount = 0;
        for (uint256 i = 0; i < players.length; i++) {
            if (scores[players[i]] == highestScore) {
                winners.push(players[i]);
                winnerCount++;
            }
        }

        require(winnerCount > 0, "No scores submitted");
        require(
            address(this).balance == prizePool,
            "Insufficient contract balance"
        );

        // **Step 1: Deduct 10% for the creator**
        uint256 creatorFee = (prizePool * 10) / 100; // 10% of the total prize pool
        prizePool -= creatorFee; // Remaining amount for winners

        // Transfer 10% to the creator
        payable(creator).transfer(creatorFee);

        // Distribute the prize
        uint256 prizeShare = prizePool / winnerCount;
        for (uint256 i = 0; i < winnerCount; i++) {
            payable(winners[i]).transfer(prizeShare);
        }
        emit TGameEnded(
            address(this),
            winners,
            highestScore,
            prizeShare,
            creatorFee
        );
    }

    function getPlayers() external view returns (address payable[] memory) {
        return players;
    }

    function getPlayerScore(address player) external view returns (uint256) {
        return scores[player];
    }

    function hasPlayerSubmittedScore(
        address player
    ) external view returns (bool) {
        return hasSubmittedScore[player];
    }

    function getPrizePool() external view returns (uint256) {
        return prizePool;
    }

    function getWinners() external view returns (address[] memory) {
        require(gameEnded, "Game has not ended yet");
        return winners;
    }

    function getDuration() external view returns (uint256) {
        return duration;
    }
}

// packages/foundry/contracts/SnakeFactory.sol

contract SnakeFactory {
    address[] public deployedGames;
    address[] public deployedTournament;

    event GameCreated(
        address indexed gameAddress,
        address indexed creator,
        string name,
        uint256 stakeAmount,
        uint8 maxPlayers,
        uint256 duration
    );
    event TournamentCreated(
        address indexed tournamentAddress,
        string name,
        uint256 duration,
        uint256 entryFee,
        uint256 maxPlayers,
        bool isWeekly
    );

    function createGame(
        string memory _name,
        uint256 _stakeAmount,
        uint8 _maxPlayers,
        uint256 _duration
    ) external payable {
        require(msg.value == _stakeAmount, "Stake amount mismatch");
        require(
            msg.sender.balance >= _stakeAmount,
            "Insufficient balance to stake"
        );

        LobbyGame newGame = (new LobbyGame){value: msg.value}(
            msg.sender,
            _name,
            _stakeAmount,
            _maxPlayers,
            _duration
        );

        deployedGames.push(address(newGame));

        emit GameCreated(
            address(newGame),
            msg.sender,
            _name,
            _stakeAmount,
            _maxPlayers,
            _duration
        );
    }

    function getDeployedGames() external view returns (address[] memory) {
        return deployedGames;
    }

    function createTournamentGame(
        address _creator,
        string memory _name,
        uint256 _duration,
        uint256 _entryFee,
        uint256 _maxPlayers,
        bool _isWeekly
    ) external {
        TournamentGame newGame = new TournamentGame(
            _creator,
            _name,
            _duration,
            _entryFee,
            _maxPlayers,
            _isWeekly
        );

        deployedTournament.push(address(newGame));
        emit TournamentCreated(
            address(newGame),
            _name,
            _duration,
            _entryFee,
            _maxPlayers,
            _isWeekly
        );
    }

    function getDeployedTournament() external view returns (address[] memory) {
        return deployedTournament;
    }
}

