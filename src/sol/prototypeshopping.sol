pragma solidity ^0.4.23;
import './builtin.sol';

contract Shopping {
    using Builtin for Shopping;
    //productid => user
    mapping(uint128 => address) ownersOfProducts;
    //user => (productid => count)
    mapping(address => mapping(uint128 => uint128)) productsOfOwners; 
    
    event Buy(address, uint128, uint128);
    
    function buy(uint128 productid, uint128 count) public {
        ownersOfProducts[productid] = msg.sender;
        productsOfOwners[msg.sender][productid] = productsOfOwners[msg.sender][productid]+count;
    
        emit Buy(msg.sender, productid, uint128(block.timestamp));
    }
    
    function countOf(uint128 productid) public view returns (uint128) {
        return productsOfOwners[msg.sender][productid];
    }
    
    function consume(uint128 productid,uint128 consumed) public{
        require(productsOfOwners[msg.sender][productid] >= consumed);
        productsOfOwners[msg.sender][productid] = productsOfOwners[msg.sender][productid]-consumed;
    }

    //builtin
    function p_creditPlan() public view returns(uint256 credit, uint256 recoveryRate){
        return this.$creditPlan();
    }
    function p_setCreditPlan(uint256 credit, uint256 recoveryRate) public{
        this.$setCreditPlan(credit, recoveryRate);
    }
    function p_isUser(address user) public view returns(bool){
        return this.$isUser(user);
    }
    function p_userCredit(address user) public view returns(uint256){
        return this.$userCredit(user);
    }
    function p_addUser(address user) public{
        this.$addUser(user);
    }
    function p_removeUser(address user) public{
        this.$removeUser(user);
    }
    // function p_sponsor() public{
    //     this.$sponsor();
    // }
    // function p_unsponsor() public{
    //     this.$unsponsor();
    // }
    function p_isSponsor(address sponsor) public view returns(bool){
        return this.$isSponsor(sponsor);
    }
    function p_selectSponsor(address sponsor) public{
        this.$selectSponsor(sponsor);
    }
    function p_currentSponsor() public view returns(address){
        return this.$currentSponsor();
    }
    
}