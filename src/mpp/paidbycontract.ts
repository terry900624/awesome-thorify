'use strict'
import { web3server, getPrototypeShoppingContract,addressFromPriv,getPrototpyeShoppingAddr,getEnergyContract } from './utils'
import { BigNumber } from 'bignumber.js';
import { Config } from '../config';

let productID1 = 1;
let transfers = new BigNumber('1000000000000000000000', 10);
let recoverate = new BigNumber(0);
let credit = transfers;
let credit2 = new BigNumber(0);

//buy
let buy = async (psc,buyer,productID,count) => {
    return await psc.methods.buy(productID, count).send({
		from: buyer, 
		gas: 100000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(res=>console.log('buyer:', buyer, 'bought', productID, 'product' + productID, 'and used energy:' + new BigNumber(res.paid, 10).toString(10)))
    .catch(e=>console.log(e));
}

//countOf
let countOf = async (psc,buyer,productID) => {
    let ret = await psc.methods.countOf(productID).call({
        from: buyer
    });
    console.log('buyer:', buyer, 'look up his/her product' + productID, 'and the total is:', new BigNumber(ret, 10).toString(10));
}

//report buyer info
let reportBuyer = async (buyer) => {
    let buyerEng = await web3server.getEnergy(buyer)
    console.log('buyer:', buyer, 'has energy:', new BigNumber(buyerEng, 10).toString(10))
}

let reportContract = async (contract) => {
    let contractEng = await web3server.getEnergy(contract)
    console.log('contract:', contract, 'has energy:', new BigNumber(contractEng, 10).toString(10))
}

//reportUserCredit
let reportUserCredit = async (psc,user) => {
    let credit = await psc.methods.p_userCredit(user).call();
    console.log('buyer:', user,'has credits:', new BigNumber(credit, 10).toString(10));
}

let transfer = async (from,to,value) => {
    
    const energyContract = await getEnergyContract();
	//检查合约sponsor持有的token数量
	let fromBalance = await energyContract.methods.balanceOf(from).call();
	console.log("fromBalance:",fromBalance);
	//检查contract的token持有数量
	let toBalance = await energyContract.methods.balanceOf(to).call();
    console.log("toBalance:",toBalance);
	if(new BigNumber(fromBalance,10).isLessThan(value)) throw new Error('out of balance');
	//开始交易
	await energyContract.methods
	.transfer(to, value)
	.send({
		from: from, 
		gas: 100000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(()=>console.log(`success transfer from ${from} to ${to}:${value.toString(10)}`))
	.catch(e=>console.log(e));
	//检查合约sponsor持有的token数量
	fromBalance = await energyContract.methods.balanceOf(from).call();
	console.log("fromBalance:",fromBalance);
	//检查contract的token持有数量
	toBalance = await energyContract.methods.balanceOf(to).call();
	console.log("toBalance:",toBalance);
    
}

//reportUserCredit
let p_creditPlan = async (psc) => {
    return await psc.methods.p_creditPlan().call();
}

let p_setCreditPlan = async (psc, credit, recoverate) => {
    let creditPlan = await p_creditPlan(psc);
    if(creditPlan.credit && (creditPlan.credit === credit.toString(10))){
        console.log('credit plan already set,', 'credits limit:', credit.toString(10), 'recoverate:', recoverate.toString(10));
    }else{
        await psc.methods.p_setCreditPlan(credit, recoverate).send({
            from: Config.master, 
            gas: 100000, 
            nonce: new Date().getTime().toString().substring(5,13)
        })
        .then(()=>console.log('user plan set', 'credits limit:', credit.toString(10), 'recoverate:', recoverate.toString(10)))
        .catch(e=>console.log(e));
    }
}

//isUser
let p_isUser = async (psc,user) => {
    return await psc.methods.p_isUser(user).call();
}

let p_addUser = async (psc, user) => {
    //check isUser
    let isUser = await p_isUser(psc, user);
    console.log("buyer:", user,"isUser:",isUser);
    if (isUser) {
        console.log('buyer:', user, 'already added to `shoppingContract`')
    } else {
        //add user to contract
        return await psc.methods.p_addUser(user).send({
            from: Config.master, 
            gas: 100000, 
            nonce: new Date().getTime().toString().substring(5,13)
        })
        .then(()=>console.log('buyer:', user, 'added to `shoppingContract`'))
        .catch(e=>console.log(e));
    }
}

let p_removeUser = async (psc, user) => {
    //check isUser
   let isUser = await p_isUser(psc, user);
   console.log("buyer:", user,"isUser:",isUser);
   if (!isUser) {
       console.log('buyer:', user, 'is not in `shoppingContract`')
   } else {
       //remove user from contract
       return await psc.methods.p_removeUser(user).send({
           from: Config.master, 
           gas: 100000, 
           nonce: new Date().getTime().toString().substring(5,13)
       })
       .then(()=>console.log('buyer:', user, 'is removed from `shoppingContract`'))
       .catch(e=>console.log(e));
   }
}

//shopping
let shopping = async (buyer,sponsor) => {
    const psc = await getPrototypeShoppingContract();
    const shoppingAddr = await getPrototpyeShoppingAddr();
    //给合约打币
    await transfer(sponsor,shoppingAddr,transfers);
    //设置creditPlan
    await p_setCreditPlan(psc,credit, recoverate);
    //添加user
    await p_addUser(psc,buyer);
    //记录初始数据
    await reportBuyer(buyer);
    await reportUserCredit(psc,buyer);
    await reportContract(shoppingAddr);
    //第一次购买
    await buy(psc,buyer,productID1,10);
    await reportBuyer(buyer);
    await reportUserCredit(psc,buyer);
    await reportContract(shoppingAddr);
    await countOf(psc,buyer,productID1);
    //修改creditPlan
    await p_setCreditPlan(psc,credit2, recoverate);
    //第二次购买
    await buy(psc,buyer,productID1,10);
    await reportBuyer(buyer);
    await reportUserCredit(psc,buyer);
    await reportContract(shoppingAddr);
    await countOf(psc,buyer,productID1);
    //修改creditPlan
    await p_setCreditPlan(psc,credit, recoverate);
    //把user移除
    await p_removeUser(psc,buyer);
    //第三次购买
    await buy(psc,buyer,productID1,10);
    await reportBuyer(buyer);
    await reportUserCredit(psc,buyer);
    await reportContract(shoppingAddr);
    await countOf(psc,buyer,productID1);
}

try {
    web3server.addPrivateKey(Config.masterKey);
    let buyerPri = '321d6443bc6177273b5abf54210fe806d451d6b7973bccc2384ef78bbcd0bf51';
    let buyer = addressFromPriv(buyerPri);
    web3server.addPrivateKey(buyerPri);
    let sponsorPriv = '593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e';
    let sponsor = addressFromPriv(sponsorPriv);
    web3server.addPrivateKey(sponsorPriv);
    shopping(buyer,sponsor)
} catch (e) {
    console.log('shooping error:', e)
}