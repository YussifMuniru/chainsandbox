// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Coin{

    address public minter;
    mapping(address => uint) public balances;

    event Send(address from , address to , uint amount);

    constructor(){
        minter = msg.sender;
    } 

    function mint(uint amount) public {
        require(msg.sender == minter, "Only the minter can mint coins");
        balances[msg.sender] = amount;
    }


    error InsufficientBalance(uint requested, uint available);


    function send(address sender,address receiver, uint amount) public {
        if(amount >= balances[sender]){
            revert  InsufficientBalance(amount, balances[minter]);
        }

        balances[sender] -= amount;
        balances[receiver] += amount;
        emit Send(sender, receiver, amount);
    }


function getBalance(address user) public view returns (uint){
    return balances[user];  
}

}
