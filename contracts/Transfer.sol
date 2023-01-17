// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Transfer {
    address private owner;

    address[] whiteList;

    event ProxyDeposit(address token, address from, address to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function checkOfWhiteList(address adr) private view returns (bool) {
        for (uint256 index = 0; index < whiteList.length; index++) {
            if (adr == whiteList[index]) {
                return true;
            }
        }

        return false;
    }

    function addWhiteList(address adr) external onlyOwner {
        whiteList.push(adr);
    }

    modifier checkOfWhiteLists(address adr) {
        require(checkOfWhiteList(adr), "Not WhiteList");
        _;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function setOwner(address wallet) external onlyOwner returns (address) {
        owner = wallet;
        return owner;
    }

    function proxyTokenWithoutOwner(
        address token,
        address to,
        uint256 amount
    ) public payable checkOfWhiteLists(to) {
        IERC20(token).transferFrom(msg.sender, to, amount);

        emit ProxyDeposit(token, msg.sender, to, amount);
    }
}
