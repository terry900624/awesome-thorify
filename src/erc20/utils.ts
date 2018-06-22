import fs = require('fs');
import path = require("path");
import { Config } from '../config';
import { Web3Server } from '../erc20/web3server'

const ethUtil = require('ethereumjs-util')

//for deploy contract and contract call
export let web3server = new Web3Server(Config.web3Host);

//run `npm run deploy` to generate deploy.json
export let getTokenAddr = async ():Promise<string> => {
    let deployJSON:string = fs.readFileSync(path.join(__dirname, '../deploy.json'), {
        encoding: 'utf-8'
    });
    let contractAddr:string = JSON.parse(deployJSON).contractAddress;
    let code = await web3server.getCode(contractAddr);
    if (!code) {
        throw new Error('token contract not deployed')
    }
    return contractAddr;
}

export let addressFromPriv = (privKey: string):string => {
    return '0x' + ethUtil.privateToAddress(new Buffer(privKey, 'hex')).toString('hex')
}   

export let getTokenABI = async () => {
    let abi = fs.readFileSync(path.join(__dirname, '../sol/erc20.abi'), {
        encoding: 'utf-8'
    });
    return JSON.parse(abi);
}

export let getTokenCode = async () => {
    let code = fs.readFileSync(path.join(__dirname, '../sol/erc20.bytecode'), {
        encoding: 'utf-8'
    });
    return code;
}

export let saveDeployResult = async (result) => {
    return fs.writeFileSync(path.join(__dirname, '../deploy.json'), JSON.stringify(result), {
        encoding: 'utf-8'
    })
}

export let getTokenContract = async() => {
    const tokenAddr = await getTokenAddr();
	const tokenABI = await getTokenABI();
	return web3server.Contract(tokenABI, tokenAddr);
}
