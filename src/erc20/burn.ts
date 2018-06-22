'use strict'
import { web3server, getTokenContract } from './utils'
import { Config } from '../config';

let burn = async (value) => {
    web3server.addPrivateKey(Config.masterKey)
    const tokenContract = await getTokenContract();
    
	let masterBalance = await tokenContract.methods.balanceOf(Config.master).call();
    console.log("masterBalance:",masterBalance);
    let totalSupply = await tokenContract.methods.totalSupply().call();
    console.log("totalSupply:",totalSupply);
    
	await tokenContract.methods
	.burn(value)
	.send({
		from: Config.master, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(res=>console.log(res))
	.catch(e=>console.log(e));
	
	masterBalance = await tokenContract.methods.balanceOf(Config.master).call();
    console.log("masterBalance:",masterBalance);
    totalSupply = await tokenContract.methods.totalSupply().call();
    console.log("totalSupply:",totalSupply);
}

burn(10000);
