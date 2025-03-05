// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

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

    // Events
    event PlayerJoined(
        address indexed player,
        uint256 stakeAmount,
        uint256 newPrizePool
    );
    event PlayerQuit(
        address indexed player,
        uint256 refundAmount,
        uint256 newPrizePool
    );
    event GameStarted(address contractAddress, uint256 startTime);
    event ScoreSubmitted(address indexed player, uint256 score);
    event GameEnded(
        address contractAddress,
        address[] winners,
        uint256 highestScore,
        uint256 prizeShare
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

        emit PlayerJoined(msg.sender, msg.value, prizePool);
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
        emit PlayerQuit(msg.sender, refundAmount, prizePool);
    }

    function submitScore(uint256 score) external {
        require(isPlayer[msg.sender], "Not a registered player"); // Ensure only registered players can submit scores
        require(!hasSubmittedScore[msg.sender], "Score already submitted");
        require(gameStarted == true, "The game has not started");

        scores[msg.sender] = score;
        hasSubmittedScore[msg.sender] = true;
        emit ScoreSubmitted(msg.sender, score);
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

        // Distribute the prize
        uint256 prizeShare = prizePool / winnerCount;
        for (uint256 i = 0; i < winnerCount; i++) {
            payable(winners[i]).transfer(prizeShare);
        }
        emit GameEnded(address(this), winners, highestScore, prizeShare);
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
