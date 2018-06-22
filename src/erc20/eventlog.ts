'use strict'
import { web3server,getTokenContract} from './utils'
import { Config } from '../config';


let getTransferLog = async () => {
    let tokenContract = await getTokenContract();
    //获取最新的block
    let block = await web3server.getBlock('latest');
    console.log("block:",block);
    //获取Transfer log
	await tokenContract.getPastEvents('Transfer',{
        filter:{from:'0x'+Config.master},
        fromBlock: 0,
        toBlock: block.number
    }, function(error, events){ 
        console.log(error,events); 
    });
}

getTransferLog();