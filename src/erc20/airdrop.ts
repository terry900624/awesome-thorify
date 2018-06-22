'use strict'
import { web3server, getTokenContract,addressFromPriv } from './utils'
import { Config } from '../config';

//测试用户
const accountPri = '593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e';
const account =  addressFromPriv(accountPri);


//空投token
let airDrop = async (address,value) => {
    web3server.addPrivateKey(Config.masterKey)
	const tokenContract = await getTokenContract();
	//检查合约owner持有的token数量
	let masterBalance = await tokenContract.methods.balanceOf(Config.master).call();
	console.log("masterBalance:",masterBalance);
	//检查被投放人的token持有数量
	let toBalance = await tokenContract.methods.balanceOf(address.slice(2)).call();
	console.log("toBalance:",toBalance);
	if(masterBalance < value) throw new Error('空投数量不能大于实际持有数量');
	//开始投放
	await tokenContract.methods
	.transfer(address, value)
	.send({
		from: Config.master, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(res=>console.log(res))
	.catch(e=>console.log(e));
	//检查合约owner持有的token数量
	masterBalance = await tokenContract.methods.balanceOf(Config.master).call();
	console.log("masterBalance:",masterBalance);
	//检查被投放人的token持有数量
	toBalance = await tokenContract.methods.balanceOf(address.slice(2)).call();
	console.log("toBalance:",toBalance);
}

airDrop(account,10000);
