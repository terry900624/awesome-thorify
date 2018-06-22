'use strict'
import { Config } from '../config';
import {getTokenABI, getTokenCode,web3server,saveDeployResult} from './utils';


let deploy = async () => {
    web3server.addPrivateKey(Config.masterKey);
    let contractCode = await getTokenCode();
    let tokenABI = await getTokenABI();
    let tokenContract = web3server.Contract(tokenABI)
    let result = null;
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