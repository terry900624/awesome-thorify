'use strict'
import { web3server, getTokenContract,addressFromPriv } from './utils'

//测试用户
const accountPri = '593537225b037191d322c3b1df585fb1e5100811b71a6f7fc7e29cca1333483e';
const account =  addressFromPriv(accountPri);

//销毁token
let burn = async (account,value) => {
    web3server.addPrivateKey(accountPri)
    const tokenContract = await getTokenContract();
    //检查用户持有的token数量
	let accountBalance = await tokenContract.methods.balanceOf(account).call();
    console.log("accountBalance:",accountBalance);
    //token总数
    let totalSupply = await tokenContract.methods.totalSupply().call();
    console.log("totalSupply:",totalSupply);
    if(accountBalance<value) throw new Error('销毁数量不能大于用户实际持有数量');
    //开始销毁
	await tokenContract.methods
	.burn(value)
	.send({
		from: account, 
		gas: 1000000, 
		nonce: new Date().getTime().toString().substring(5,13)
	})
	.then(res=>console.log(res))
	.catch(e=>console.log(e));
	//检查用户持有的token数量
	accountBalance = await tokenContract.methods.balanceOf(account).call();
    console.log("accountBalance:",accountBalance);
    //token总数
    totalSupply = await tokenContract.methods.totalSupply().call();
    console.log("totalSupply:",totalSupply);
}

burn(account,10000);
