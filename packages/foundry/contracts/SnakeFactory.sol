// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./LobbyGame.sol";
import "./TournamentGame.sol";

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
