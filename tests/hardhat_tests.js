const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");

describe("Modifier Contract", function () {
  let accOwner;
  let accGuest;
  let accAnother;

  let ctrct;
  let erc;

  async function InitContracts() {
    [accOwner, accGuest, accAnother] = await ethers.getSigners();
    const Transfer = await ethers.getContractFactory("ModifiedTransfer", accOwner);
    ctrct = await Transfer.connect(accOwner).deploy();
    await ctrct.deployed();
  }

  async function InitERC() {
    const ERC = await ethers.getContractFactory("ERC20token", accOwner);
    erc = await ERC.connect(accOwner).deploy();
    await erc.deployed();
  }

  describe("Base", async function () {
    beforeEach(async function() {
      await InitContracts();
      await InitERC();
    });

    it("Success test Contract deployed", async function () {
      expect(ctrct.address).to.be.properAddress;
      expect(erc.address).to.be.properAddress;
    });

  });

  describe("Owner", async function () {
    beforeEach(async function() {
      await InitContracts();
      await InitERC();
    });

    it("Check initial owner", async function () {
      const owner = await ctrct.getOwner()
      expect(owner).to.eq(accOwner.address);
    });

    it("Set Owner success by owner", async function () {
      const new_owner = await ctrct.setOwner(accGuest.address)
      const owner = await ctrct.getOwner()
      expect(owner).to.eq(accGuest.address);
    });

    it("Set Owner failed by another account r", async function () {
      await expect(
        ctrct.connect(accGuest).setOwner(accGuest.address)
      ).to.be.revertedWith("Caller is not owner");
    });

  });

  describe("checkOfWhiteList --- not working for Private function. Neew make Public for tests", async function () {
    beforeEach(async function() {
      await InitContracts();
    });

    it("False for empty list", async function () {
      const result = await ctrct.connect(accGuest).checkOfWhiteList(accGuest.address)
      expect(result).to.eq(false);
    });
  });

  describe("addWhiteList", async function () {
    beforeEach(async function() {
      await InitContracts();
    });

    it("Ssuccess by owner", async function () {
      await ctrct.connect(accOwner).addWhiteList(accGuest.address)
      const result = await ctrct.connect(accGuest).checkOfWhiteList(accGuest.address)
      expect(result).to.eq(true);
    });

    it("Failed by guest", async function () {
      await expect(
        ctrct.connect(accGuest).addWhiteList(accGuest.address)
      ).to.be.revertedWith("Caller is not owner");
    });
  });

  describe("deleteFromWhiteList", async function () {
    beforeEach(async function() {
      await InitContracts();
      const tx = await ctrct.connect(accOwner).addWhiteList(accGuest.address);
      await tx.wait();

      const result = await ctrct.connect(accOwner).checkOfWhiteList(accGuest.address)
      expect(result).to.eq(true);      
    });

    it("Success by owner", async function () {
      const tx =  await ctrct.connect(accOwner).deleteFromWhiteList(accGuest.address)
      await tx.wait();

      const result = await ctrct.connect(accOwner).checkOfWhiteList(accGuest.address)
      expect(result).to.eq(false);
    });

    it("Failed by guest", async function () {
      await expect(
        ctrct.connect(accGuest).deleteFromWhiteList(accGuest.address)
      ).to.be.revertedWith("Caller is not owner");
    });
  });

  describe("proxyToken", async function () {
    const amount = 10
    beforeEach(async function() {
      await InitContracts();
      await InitERC();
      const tx = await ctrct.connect(accOwner).addWhiteList(accGuest.address);
      await tx.wait();   
      
      const tx2 = await erc.connect(accOwner).approve( ctrct.address, amount );
      await tx2.wait();
    });

    it("Success by owner", async function () {
      const tx =  await ctrct.connect(accOwner).proxyToken(erc.address, accGuest.address, amount)
      await tx.wait();

    });

    it("Failed by not whitelisted", async function () {
      const tx =  await ctrct.connect(accOwner).deleteFromWhiteList(accGuest.address)
      await tx.wait();

      await expect(
        ctrct.connect(accOwner).proxyToken(erc.address, accGuest.address, amount)
      ).to.be.revertedWith("Not WhiteList");
    });
  });

});

