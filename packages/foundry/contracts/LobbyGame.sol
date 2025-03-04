// SPDX-License Identifier: MIT
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract LobbyGame {
    address public creator;
    uint256 public stakeAmount;
    uint8 public maxPlayers;
    uint256 public duration;
    address payable[] public  players;
    uint256 public startTime;
    bool public gameEnded;
    uint256 prizePool;

    mapping(address => uint256) public scores;
    mapping(address => bool) public hasSubmittedScore;

    constructor(
        address _creator,
        uint256 _stakeAmount,
        uint8 _maxPlayers,
        uint256 _duration
    ) payable {
        require(msg.value == _stakeAmount, "Stake amount mismatch");
        creator = _creator;
        stakeAmount = _stakeAmount;
        maxPlayers = _maxPlayers;
        duration = _duration;
        players.push(payable(_creator));
        startTime = block.timestamp;
        gameEnded = false;
        prizePool = msg.value;
    }

    function joinGame() external payable {
        require(players.length < maxPlayers, "Lobby is full");
        require(msg.value == stakeAmount, "Incorrect stake amount");
        players.push(payable(msg.sender));
        prizePool += msg.value;
    }

    function submitScore(uint256 score) external {
        require(!hasSubmittedScore[msg.sender], "Score already submitted");

        scores[msg.sender] = score;
        hasSubmittedScore[msg.sender] = true;
    }

    function endGame() external {
        gameEnded = true;

        // Determine the highest score
        uint256 highestScore = 0;
        for (uint256 i = 0; i < players.length; i++) {
            if (scores[players[i]] > highestScore) {
                highestScore = scores[players[i]];
            }
        }

        // Identify all players with the highest score
        address[] memory winners;
        uint256 winnerCount = 0;
        for (uint256 i = 0; i < players.length; i++) {
            if (scores[players[i]] == highestScore) {
                winners[winnerCount] = players[i];
                winnerCount++;
            }
        }

        // Calculate the prize share for each winner
        uint256 prizeShare = prizePool / winnerCount;

        // Distribute the prize to each winner
        for (uint256 i = 0; i < winnerCount; i++) {
            payable(winners[i]).transfer(prizeShare);
        }
    }
}
