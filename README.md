# Transfer Proxy Contract

The `Transfer.sol` contract is a secure, minimal proxy contract that facilitates token transfers on behalf of users. It is designed to enable **meta-transactions**, **batch payments**, and **delegated transfers** within dApps and backend-controlled flows like those used in Assetux Layer 2.

---

## 🔍 Overview

* **Primary Role**: Transfers ERC-20 tokens from the proxy to a recipient.
* **Deployer Control**: Only the contract deployer can initiate transfers.
* **Security**: Implements `Ownable` from OpenZeppelin to restrict access.
* **Use Case**: Acts as an execution layer for microservices or bots to perform verified token transfers without exposing user keys.

---

## 🧠 Contract Summary

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Transfer is Ownable {
    function transfer(address _token, address _to, uint _amount) external onlyOwner {
        IERC20(_token).transfer(_to, _amount);
    }
}
```

---

## 🔐 Access Control

Only the contract **owner** (typically a backend signer or deployer wallet) can call the `transfer` function. Unauthorized addresses will be reverted via the `onlyOwner` modifier.

---

## 🛠️ Functionality

### `transfer(address _token, address _to, uint _amount)`

Transfers `_amount` of an ERC-20 token from this contract to `_to`.

* `_token`: The ERC-20 token address
* `_to`: Recipient wallet address
* `_amount`: Number of tokens (in base units)

> ⚠️ Ensure the contract holds enough tokens to complete the transfer.

---

## 🚀 Deployment

### Requirements

* Solidity ^0.8.20
* OpenZeppelin Contracts

### Deploy via Hardhat

```bash
npm install @openzeppelin/contracts
```

```solidity
const Transfer = await ethers.getContractFactory("Transfer");
const transferProxy = await Transfer.deploy();
await transferProxy.deployed();

console.log("Transfer Proxy deployed at:", transferProxy.address);
```

---

## 🔄 Token Preparation

To allow the proxy to send tokens, you must first **send tokens to the proxy address**:

```javascript
await erc20Token.transfer(proxyAddress, amount);
```

Then trigger the proxy transfer:

```javascript
await transferProxy.transfer(tokenAddress, recipientAddress, amount);
```

---

## 📦 Integration Scenarios

* ✅ Use with microservices for payouts
* ✅ Enable Telegram bots to control funds without private keys
* ✅ Batch payments through orchestration
* ✅ Simplified relayer model for controlled wallets

---

## 🧪 Security Note

* All transfers are strictly permissioned to the contract owner.
* Make sure the owner wallet is securely stored (e.g., in a backend service or cold wallet).
* Use multi-sig if needed for increased safety.

---

## 📜 License

MIT License — Free to use and modify for both personal and commercial purposes.
