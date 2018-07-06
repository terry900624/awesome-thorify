'use strict'
import { Config } from '../config';
import {getPrototpyeShoppingABI, getPrototpyeShoppingCode,web3server,saveDeployResult} from './utils';

//发布erc20 Token
let deploy = async () => {
    web3server.addPrivateKey(Config.masterKey);
    //获取合约code
    let contractCode = await getPrototpyeShoppingCode();
    //获取合约abi
    let prototpyeShoppingABI = await getPrototpyeShoppingABI();
    let prototpyeShoppingContract = web3server.Contract(prototpyeShoppingABI)
    let result = null;
    //发布合约
    await prototpyeShoppingContract.deploy({
        data: contractCode
    }).send({
        from: Config.master,
        gas: 3000000,
        nonce: Math.round(Math.random()*100000000)
    }).on('receipt', function(receipt){
        result = receipt; // contains the new contract address
        return receipt;
    })
    if(result){
        //记录合约部署信息（address等）
        await saveDeployResult(result);
        console.log('prototype shopping contract created:', result.contractAddress)
    }else{
        console.error('deploy failed');
    }
}

try {
    deploy();
} catch (e) {
    console.log('error:', e)
}