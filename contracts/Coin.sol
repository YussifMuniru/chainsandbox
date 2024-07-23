// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Coin{

    address public minter;
    mapping(address => uint) public balances;

    event Send(address from , address to , uint amount);

    constructor(){
        minter = msg.sender;
    } 

    function mint(address receiver, uint amount) public {
        require(msg.sender == receiver, "Only the minter can mint coins");
        balances[receiver] = amount;
    }


    error InsufficientBalance(uint requested, uint available);


    function send(address receiver, uint amount) public {
        if(amount <= balances[msg.sender]){
            revert  InsufficientBalance(amount, balances[minter]);
        }

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Send(msg.sender, receiver, amount);
    }


}
