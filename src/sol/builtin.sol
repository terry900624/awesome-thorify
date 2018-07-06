pragma solidity ^0.4.23;
import './prototype.sol';

library Builtin {
    Prototype constant prototype = Prototype(uint160(bytes9("Prototype")));
    function $master(address self) internal view returns(address){
        return prototype.master(self);
    }
    function $setMaster(address self, address newMaster) internal {
        prototype.setMaster(self, newMaster);
    }
    function $balance(address self, uint blockNumber) internal view returns(uint256){
        return prototype.balance(self, blockNumber);
    }
    function $energy(address self, uint blockNumber) internal view returns(uint256){
        return prototype.energy(self, blockNumber);
    }
    function $hasCode(address self) internal view returns(bool){
        return prototype.hasCode(self);
    }
    function $storageFor(address self, bytes32 key) internal view returns(bytes32){
        return prototype.storageFor(self, key);
    }
    function $creditPlan(address self) internal view returns(uint256 credit, uint256 recoveryRate){
        return prototype.creditPlan(self);
    }
    function $setCreditPlan(address self, uint256 credit, uint256 recoveryRate) internal{
        prototype.setCreditPlan(self, credit, recoveryRate);
    }
    function $isUser(address self, address user) internal view returns(bool){
        return prototype.isUser(self, user);
    }
    function $userCredit(address self, address user) internal view returns(uint256){
        return prototype.userCredit(self, user);
    }
    function $addUser(address self, address user) internal{
        prototype.addUser(self, user);
    }
    function $removeUser(address self, address user) internal{
        prototype.removeUser(self, user);
    }
    function $sponsor(address self) internal{
        prototype.sponsor(self);
    }
    function $unsponsor(address self) internal{
        prototype.unsponsor(self);
    }
    function $isSponsor(address self, address sponsor) internal view returns(bool){
        return prototype.isSponsor(self, sponsor);
    }
    function $selectSponsor(address self, address sponsor) internal{
        prototype.selectSponsor(self, sponsor);
    }
    function $currentSponsor(address self) internal view returns(address){
        return prototype.currentSponsor(self);
    }
}