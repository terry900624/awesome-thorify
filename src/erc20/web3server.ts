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
    addPrivateKey(privKey: string) {
        this.web3.eth.accounts.wallet.add('0x' + privKey);
        let user = '0x' + ethUtil.privateToAddress(new Buffer(privKey, 'hex')).toString('hex');
        if (!this.users) {
            this.users = [];
        }
        this.users.push(user);
        return user;
    }
    async getCode(addr: string) {
        return this.web3.eth.getCode(addr);
    }
    async getBalance(addr: string) {
        return this.web3.eth.getBalance(addr);
    }
    async getEnergy(addr: string) {
        return this.web3.eth.getEnergy(addr);
    }

    Contract(abi, address?:string){
        if(!address) return new this.web3.eth.Contract(abi);
        else return new this.web3.eth.Contract(abi, address);
    }

}