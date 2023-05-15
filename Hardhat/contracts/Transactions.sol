// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    struct particularTransaction{
        string fName;
        address receiver;
        uint256 amount;
        string message;
    }

    struct transactionMember{
        string fname;
        address receiver;
    }

    mapping(address=> particularTransaction[]) alltransactions;

    mapping (address=> transactionMember[]) allmembers;

    function addToBlockchain(address sender,string memory fName ,address payable receiver, uint256 amount, string memory message)public{
    particularTransaction[] storage tempArrForTransactions =alltransactions[sender];
    tempArrForTransactions.push(particularTransaction(fName,receiver,amount,message));
    
    transactionMember[] storage tempArrForMembers = allmembers[sender];
    tempArrForMembers.push(transactionMember(fName,receiver));
    }

    function getAllTransactions(address sender)public view returns(particularTransaction[] memory){
        return alltransactions[sender];
    }
    function getAllMembers(address sender)public view returns(transactionMember[] memory){
        return allmembers[sender];
    }
    function len(address sender) public view returns (uint256){
        return alltransactions[sender].length;
    }
}