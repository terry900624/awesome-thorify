'use strict'
import { web3server,getTokenContract,addressFromPriv} from './utils'
import { Config } from '../config';

let approve = async (from,to,amount) => {
    let tokenContract = await getTokenContract();
	let masterBalance = await tokenContract.methods.balanceOf(from).call();
    console.log("masterBalance:",masterBalance);
    let approve = await tokenContract.methods.allowance(Config.master,to).call();
    console.log(approve);
	await tokenContract.methods
	.approve(to, amount)
	.send({
		from: from, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(res=>console.log(res))
    .catch(e=>console.log(e));
    approve = await tokenContract.methods.allowance(from,to).call();
    console.log(approve);
}

let useApproveBalance = async (from,to,origin,amount) => {
    let tokenContract = await getTokenContract();
    let originBalance = await tokenContract.methods.balanceOf(origin).call();
    console.log("originBalance:",originBalance);
    let fromBalance = await tokenContract.methods.balanceOf(from).call();
    console.log("fromBalance:",fromBalance);
    let toBalance = await tokenContract.methods.balanceOf(to).call();
    console.log("toBalance:",toBalance);
    await tokenContract.methods
	.transferFrom(origin,to,amount)
	.send({
		from: from, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
    })
    originBalance = await tokenContract.methods.balanceOf(origin).call();
    console.log("originBalance:",originBalance);
    fromBalance = await tokenContract.methods.balanceOf(from).call();
    console.log("fromBalance:",fromBalance);
    toBalance = await tokenContract.methods.balanceOf(to).call();
    console.log("toBalance:",toBalance);
}

let main = async() => {
    const accountPri1 = '593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e';
    const address1 =  addressFromPriv(accountPri1);
    const accountPri2 = '321d6443bc6177273b5abf54210fe806d451d6b7973bccc2384ef78bbcd0bf51';
    const address2 =  addressFromPriv(accountPri2);
    web3server.addPrivateKey(Config.masterKey)
    await approve(Config.master,address1,1000000);
    web3server.addPrivateKey(accountPri1)
    await useApproveBalance(address1,address2,Config.master,10000);
};

main();