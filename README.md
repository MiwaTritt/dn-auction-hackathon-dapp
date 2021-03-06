# Sample DApp for a Campaign / Kickstarter

Adapted from source code at https://github.com/StephenGrider/EthereumCasts and https://www.udemy.com/ethereum-and-solidity-the-complete-developers-guide

## Prerequisites

Install to your computer:

* [Node.js (LTS is fine)](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/en/docs/install)

Install to your browser:

* [Metamask](https://chrome.google.com/webstore/search/metamask)
  * After installing, create an account and save the mnemonic phrase for later

## Steps to Run

1. Install dependencies with yarn

```shell
yarn install
```

2. Compile the contracts

```shell
node compile.js
```

3. Modify ethereum/deploy.js
   * Replace the <> with the MetaMask mnemonic phrase that you saved earlier

```javascript
const provider = new HDWalletProvider(
  "<MetaMask Mnemonic phrase>", //mnemonic generates many accounts
  "https://rinkeby.infura.io/HflqAGsVLFBf2cFBMYoq" //access key
);
```

4. Deploy the contract to the Rinkleby Network
   * Make sure to save address where contract is deployed. This should be logged to the console

```shell
node compile.js
```

5. Modify ethereum/factory.js
   * Replace the <> with the saved address from previous step

```javascript
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "<Address of CampaignFactory>"
);
```

5. Use Remix solidity Run -> At Address with contract selected

## Links

### Development

* [Remix - Solidity Browser IDE](https://remix.ethereum.org/)
* [Truffle - DApp Framework](http://truffleframework.com/)

### Rinkleby - Public Ethereum Test Network

* [Infura - Portal into public Ethereum Test Networks](https://infura.io/)
* [Rinkeby - Etherscan for Rinkeby](https://rinkeby.etherscan.io/)
* [Rinkeby Faucet - Ether Faucet for Rinkeby](https://faucet.rinkeby.io/)

### Documentation

* [Solidity](https://solidity.readthedocs.io/en/develop/)
