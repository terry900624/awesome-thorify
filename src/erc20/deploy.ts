'use strict'
import { Config } from '../config';
import {getTokenABI, getTokenCode,web3server,saveDeployResult} from './utils';

//发布erc20 Token
let deploy = async () => {
    web3server.addPrivateKey(Config.masterKey);
    //获取合约code
    let contractCode = await getTokenCode();
    //获取合约abi
    let tokenABI = await getTokenABI();
    let tokenContract = web3server.Contract(tokenABI)
    let result = null;
    //发布合约
    await tokenContract.deploy({
        data: contractCode,
        arguments: [Config.tokenTotalSupply, 'TEST','TEST']
    }).send({
        from: Config.master,
        gas: 1500000,
        nonce: Math.round(Math.random()*100000000)
    }).on('receipt', function(receipt){
        result = receipt; // contains the new contract address
        return receipt;
    })
    if(result){
        //记录合约部署信息（address等）
        await saveDeployResult(result);
        console.log('tokencontract created:', result.contractAddress)
    }else{
        console.error('deploy failed');
    }
}

try {
    deploy();
} catch (e) {
    console.log('error:', e)
}