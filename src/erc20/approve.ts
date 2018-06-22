'use strict'
import { web3server,getTokenContract,addressFromPriv} from './utils'
import { Config } from '../config';

//授权他人使用自己的的token
let approve = async (from,to,value) => {
    let tokenContract = await getTokenContract();
    //检查用户现有token数量
	let fromBalance = await tokenContract.methods.balanceOf(from).call();
    console.log("fromBalance:",fromBalance);
    //检查用户现有的token数量是否大于授权数量
    if(fromBalance < value) throw new Error('授权数量超过实际拥有数量');
    //查看当前被授权数量
    let approve = await tokenContract.methods.allowance(from,to).call();
    console.log("approve:",approve);
    //进行授权
	await tokenContract.methods
	.approve(to, value)
	.send({
		from: from, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
    })
    .then(res=>console.log(res))
	.catch(e=>console.log(e));
    //查看当前被授权数量
    approve = await tokenContract.methods.allowance(from,to).call();
    console.log("approve:",approve);
}

//使用被授权的token进行交易
let useApproveBalance = async (from,to,origin,value) => {
    let tokenContract = await getTokenContract();
    //检查授权用户现有token数量
    let originBalance = await tokenContract.methods.balanceOf(origin).call();
    console.log("originBalance:",originBalance);
    //检查被授权用户现有token数量
    let fromBalance = await tokenContract.methods.balanceOf(from).call();
    console.log("fromBalance:",fromBalance);
    //检查接收用户现有token数量
    let toBalance = await tokenContract.methods.balanceOf(to).call();
    console.log("toBalance:",toBalance);
    //检查授权token数量
    let approve = await tokenContract.methods.allowance(origin,from).call();
    console.log("approve:",approve);
    if(approve < value)throw new Error('交易数量超过被授权的数量');
    if(originBalance < value)throw new Error('交易数量超过授权者持有的数量');
    //使用被授权的token进行交易
    await tokenContract.methods
	.transferFrom(origin,to,value)
	.send({
		from: from, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
    })
    .then(res=>console.log(res))
	.catch(e=>console.log(e))
    originBalance = await tokenContract.methods.balanceOf(origin).call();
    console.log("originBalance:",originBalance);
    fromBalance = await tokenContract.methods.balanceOf(from).call();
    console.log("fromBalance:",fromBalance);
    toBalance = await tokenContract.methods.balanceOf(to).call();
    console.log("toBalance:",toBalance);
    approve = await tokenContract.methods.allowance(origin,from).call();
    console.log("approve:",approve);
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