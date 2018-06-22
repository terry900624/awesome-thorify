'use strict'
import { web3server, getTokenContract,addressFromPriv } from './utils'
// import crypto = require('crypto');
import { Config } from '../config';

// function randomAddress(){
// 	const address: string = '0x'+crypto.randomBytes(20).toString('hex');
// 	return address;
// }

const accountPri = '593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e';
const account =  addressFromPriv(accountPri);

let airDrop = async (address) => {
    web3server.addPrivateKey(Config.masterKey)
	const tokenContract = await getTokenContract();
	let amount = Math.round(Math.random()*1000000);
	console.log('to address:',address);
	let masterBalance = await tokenContract.methods.balanceOf(Config.master).call();
	console.log("masterBalance:",masterBalance);
	await tokenContract.methods
	.transfer(address, amount)
	.send({
		from: Config.master, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(res=>console.log(res))
	.catch(e=>console.log(e));
	let toBalance = await tokenContract.methods.balanceOf(address.slice(2)).call();
	console.log("toBalance:",toBalance);
}

airDrop(account);
