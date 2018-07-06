'use strict'
import { web3server, getPrototypeShoppingContract,addressFromPriv } from './utils'
import { BigNumber } from 'bignumber.js';

let productID1 = 1;
let productID2 = 2;

//buy
let buy = async (psc,buyer,productID,count) => {
    return await psc.methods.buy(productID, count).send({
		from: buyer, 
		gas: 1000000, 
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

//consume
let consume = async (psc,buyer,productID,count) => {
    return await psc.methods.consume(productID, count).send({
		from: buyer, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(res=>console.log('buyer:', buyer, 'consumed', count, 'product' + productID2, 'and used energy:' + new BigNumber(res.paid, 10).toString(10)))
    .catch(e=>console.log(e));;
}

//report buyer info
let report = async (buyer) => {
    let buyerEng = await web3server.getEnergy(buyer)
    console.log('buyer:', buyer, 'has energy:', new BigNumber(buyerEng, 10).toString(10))
}

//shopping
let shopping = async (buyer) => {
    const psc = await getPrototypeShoppingContract();

    await report(buyer)

    await buy(psc,buyer,productID1,10);
    await report(buyer)
    await countOf(psc,buyer,productID1);

    await buy(psc,buyer,productID2,10);
    await report(buyer)
    await countOf(psc,buyer,productID2);

    await consume(psc,buyer,productID2,10);
    await report(buyer);
    await countOf(psc,buyer,productID2);
}

try {
    let buyerPri = '321d6443bc6177273b5abf54210fe806d451d6b7973bccc2384ef78bbcd0bf51';
    let buyer = addressFromPriv(buyerPri);
    web3server.addPrivateKey(buyerPri)

    shopping(buyer)
} catch (e) {
    console.log('shooping error:', e)
}