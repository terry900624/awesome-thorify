# AwesomeThorify

Realize ERC20-Token publishing and some major methods based on [thorify](https://github.com/vechain/thorify).Implemented for reference only.

## Install

First of all, thor client needs to be installed locally. To install thor:follow this [link](https://github.com/vechain/thor). 

### Running Thor

Start with solo mode,there will be 10 initial accounts for test.

```
bin/thor solo
```

### Download this project and install the dependencies

## Test

Deploy ERC20-Token
```
npm run deploy
```

Airdrop token
```
npm run airdrop
```

Approve token and spend
```
npm run approve
```

Burn token
```
npm run burn
```

Get transfer log
```
npm run eventlog
```