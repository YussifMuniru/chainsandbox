// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


contract Counter{

    uint counter;

    
    function get() public view returns (uint) {
        return counter;
    }
    function inc() public {
        counter += 1;   
    }

    function dec() public {
        counter -= 1;
    }

}