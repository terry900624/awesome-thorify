'use strict'
import { getTokenContract} from './utils'
import { Config } from '../config';


let getLog = async () => {
    let tokenContract = await getTokenContract();
	await tokenContract.getPastEvents('Transfer',{
        filter:{from:'0x'+Config.master},
        fromBlock: 0,
        toBlock: 1000
    }, function(error, events){ 
        console.log(error,events); 
    });
}

getLog();