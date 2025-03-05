// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./LobbyGame.sol";

contract SnakeFactory {
    address[] public deployedGames;

    event GameCreated(
        address indexed gameAddress,
        address indexed creator,
        string name,
        uint256 stakeAmount,
        uint8 maxPlayers,
        uint256 duration
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
}
