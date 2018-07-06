'use strict';
const ethUtil = require('ethereumjs-util')
const Web3 = require('web3');
import { thorify } from 'thorify';
export class Web3Server {
    web3: any;
    users: string[];

    constructor(host: string) {
        this.web3 = new Web3();
        thorify(this.web3, host);
    }
    //添加私钥
    addPrivateKey(privKey: string) {
        this.web3.eth.accounts.wallet.add('0x' + privKey);
        let user = '0x' + ethUtil.privateToAddress(new Buffer(privKey, 'hex')).toString('hex');
        if (!this.users) {
            this.users = [];
        }
        this.users.push(user);
        return user;
    }
    //获取block信息
    async getBlock(revision:string|number){
        return this.web3.eth.getBlock(revision);
    }
    //获取合约cde
    async getCode(addr: string) {
        return this.web3.eth.getCode(addr);
    }
    //获取balance
    async getBalance(addr: string) {
        return this.web3.eth.getBalance(addr);
    }
    //获取energy
    async getEnergy(addr: string) {
        return this.web3.eth.getEnergy(addr);
    }
    //实例contract
    Contract(abi, address?:string){
        if(!address) return new this.web3.eth.Contract(abi);
        else return new this.web3.eth.Contract(abi, address);
    }

}