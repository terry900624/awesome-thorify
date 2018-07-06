'use strict'
import { web3server, getPrototypeShoppingContract, addressFromPriv,getPrototpyeShoppingAddr } from './utils'
import { BigNumber } from 'bignumber.js';
import { Config } from '../config';

let productID1 = 1;
let transfers = new BigNumber('1000000000000000000000', 10);
let recoverate = new BigNumber(0);
let credit = transfers;

//buy
let buy = async (psc, buyer, productID, count) => {
    return await psc.methods.buy(productID, count).send({
        from: buyer,
        gas: 100000,
        nonce: new Date().getTime().toString().substring(5, 13)
    })
        .then(res => console.log('buyer:', buyer, 'bought', productID, 'product' + productID, 'and used energy:' + new BigNumber(res.paid, 10).toString(10)))
        .catch(e => console.log(e));
}

//countOf
let countOf = async (psc, buyer, productID) => {
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

let reportSponsor = async (sponsor) => {
    let sponsorEng = await web3server.getEnergy(sponsor)
    console.log('sponsor:', sponsor, 'has energy:', new BigNumber(sponsorEng, 10).toString(10))
}

let reportContract = async (contract) => {
    let contractEng = await web3server.getEnergy(contract)
    console.log('contract:', contract, 'has energy:', new BigNumber(contractEng, 10).toString(10))
}

//reportUserCredit
let reportUserCredit = async (psc, user) => {
    let credit = await psc.methods.p_userCredit(user).call({
        from: user
    });
    console.log('buyer:', user, 'has credits:', new BigNumber(credit, 10).toString(10));
}


//reportUserCredit
let p_creditPlan = async (psc) => {
    return await psc.methods.p_creditPlan().call();
}

let p_setCreditPlan = async (psc, credit, recoverate) => {
    let creditPlan = await p_creditPlan(psc);
    if (creditPlan.credit && (creditPlan.credit === credit.toString(10))) {
        console.log('credit plan already set,', 'credits limit:', credit.toString(10), 'recoverate:', recoverate.toString(10));
    } else {
        await psc.methods.p_setCreditPlan(credit, recoverate).send({
            from: Config.master,
            gas: 100000,
            nonce: new Date().getTime().toString().substring(5, 13)
        })
            .then(() => console.log('user plan set', 'credits limit:', credit.toString(10), 'recoverate:', recoverate.toString(10)))
            .catch(e => console.log(e));
    }
}

//isUser
let p_isUser = async (psc, user) => {
    return await psc.methods.p_isUser(user).call();
}

let p_addUser = async (psc, user) => {
    //add user to contract
    let isUser = await p_isUser(psc, user);
    console.log('buyer:',user,"isUser:", isUser);
    if (isUser) {
        console.log('buyer:', user, 'already added to `shoppingContract`')
    } else {
        return await psc.methods.p_addUser(user).send({
            from: Config.master,
            gas: 100000,
            nonce: new Date().getTime().toString().substring(5, 13)
        })
            .then(() => console.log('buyer:', user, 'added to `shoppingContract`'))
            .catch(e => console.log(e));
    }
}

let p_isSponsor = async (psc, sponsor) => {
    return await psc.methods.p_isSponsor(sponsor).call();
}

let p_sponsor = async (psc, sponsor) => {
    //add user to contract
    let isSponsor = await p_isSponsor(psc, sponsor);
    console.log('sponsor:',sponsor,"isSponsor:", isSponsor);
    if (isSponsor) {
        console.log('sponsor:', sponsor, 'already added to sponsor')
    } else {
        let prototypeContract = await web3server.Contract(Config.prototypeABI,Config.prototypeAddress);
        let pscAddress = await getPrototpyeShoppingAddr();
        return await prototypeContract.methods.sponsor(pscAddress).send({
            from: sponsor,
            gas: 1000000,
            nonce: new Date().getTime().toString().substring(5, 13)
        })
            .then(() => console.log('sponsor:', sponsor, 'added to sponsor'))
            .catch(e => console.log(e));
    }
}

let p_unsponsor = async (psc, sponsor) => {
    //add user to contract
    let isSponsor = await p_isSponsor(psc, sponsor);
    console.log('sponsor:',sponsor,"isSponsor:", isSponsor);
    if (!isSponsor) {
        throw new Error(`sponsor:${sponsor} is not in sponsor`);
    } else {
        let prototypeContract = await web3server.Contract(Config.prototypeABI,Config.prototypeAddress);
        let pscAddress = await getPrototpyeShoppingAddr();
        return await prototypeContract.methods.unsponsor(pscAddress).send({
            from: sponsor,
            gas: 100000,
            nonce: new Date().getTime().toString().substring(5, 13)
        })
            .then(() => console.log('sponsor:', sponsor, 'is removed from sponsor'))
            .catch(e => console.log(e));
    }
}

let p_currentSponsor = async (psc) => {
    return await psc.methods.p_currentSponsor().call();
}

let p_selectSponsor = async (psc, sponsor) => {
    //add user to contract
    let isSponsor = await p_isSponsor(psc, sponsor);
    console.log('sponsor:',sponsor,"isSponsor:", isSponsor);
    if (isSponsor) {
        let currentSponsor = await p_currentSponsor(psc);
        console.log("currentSponsor:", currentSponsor.toLowerCase());
        if (currentSponsor.toLowerCase() === sponsor) {
            console.log('sponsor:', sponsor, 'alreadly selected to currentSponsor');
        } else {
            return await psc.methods.p_selectSponsor(sponsor).send({
                from: Config.master,
                gas: 100000,
                nonce: new Date().getTime().toString().substring(5, 13)
            })
                .then(() => console.log('sponsor:', sponsor, 'selected to currentSponsor'))
                .catch(e => console.log(e));
        }
    } else {
        throw new Error(`sponsor:${sponsor} is not in sponsor`);
    }
}

//shopping
let shopping = async (buyer, sponsor) => {
    //get psc contract
    const psc = await getPrototypeShoppingContract();
    const shoppingAddr = await getPrototpyeShoppingAddr();
    //设置creditPlan
    await p_setCreditPlan(psc, credit, recoverate);
    //添加user
    await p_addUser(psc, buyer);
    //添加sponser
    await p_sponsor(psc, sponsor);
    //选择sponser
    await p_selectSponsor(psc, sponsor);
    //记录初始数据
    await reportBuyer(buyer);
    await reportUserCredit(psc, buyer);
    await reportSponsor(sponsor);
    //第一次购买
    await buy(psc, buyer, productID1, 10);
    await reportBuyer(buyer);
    await reportUserCredit(psc, buyer);
    await reportSponsor(sponsor);
    await countOf(psc, buyer, productID1);
    //取消sponser
    await p_unsponsor(psc, sponsor);
    await reportSponsor(sponsor);
    await reportContract(shoppingAddr);
    //第二次购买
    await buy(psc, buyer, productID1, 10);
    await reportBuyer(buyer);
    await reportUserCredit(psc, buyer);
    await reportSponsor(sponsor);
    await reportContract(shoppingAddr);
    await countOf(psc, buyer, productID1);
}

try {
    web3server.addPrivateKey(Config.masterKey);
    let buyerPri = '321d6443bc6177273b5abf54210fe806d451d6b7973bccc2384ef78bbcd0bf51';
    let buyer = addressFromPriv(buyerPri);
    web3server.addPrivateKey(buyerPri);
    let sponsorPriv = '593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e';
    let sponsor = addressFromPriv(sponsorPriv).toLowerCase();
    web3server.addPrivateKey(sponsorPriv);
    shopping(buyer, sponsor)
} catch (e) {
    console.log('shooping error:', e)
}