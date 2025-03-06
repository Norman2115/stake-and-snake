// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

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
