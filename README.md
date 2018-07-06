# AwesomeThorify

Realize ERC20-Token publishing and some major methods about MPP based on [thorify](https://github.com/vechain/thorify).Implemented for reference only.

## Install

First of all, thor client needs to be installed locally. To install thor:follow this [link](https://github.com/vechain/thor). 

### Running Thor

Start with solo mode,there will be 10 initial accounts for test.

```
bin/thor solo
```

### Download this project and install the dependencies

## Test

### ERC20-Token

Deploy ERC20-Token
```
npm run erc20-deploy
```

Airdrop token
```
npm run erc20-airdrop
```

Approve token and spend
```
npm run erc20-approve
```

Burn token
```
npm run erc20-burn
```

Get transfer log
```
npm run erc20-eventlog
```
### MPP

Deploy test shopping contract
```
npm run mpp-deploy
```

Shopping paid by user
```
npm run mpp-shopping
```

Shopping paid by contract
```
npm run mpp-paidbycontract
```

Shopping paid by sponsor
```
npm run mpp-paidbysponsor
```


