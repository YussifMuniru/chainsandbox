const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Deployment", function () {
  let coin;
  let owners;
  const nonMinterAddr = "0x11ac246a91BEf977874B54d598e85A1072961358";
  before(async function () {
    const Coin = await ethers.getContractFactory("Coin");
    [owners] = await ethers.getSigners();
    coin = await Coin.deploy();
  });

  describe("Minting", function () {
    it("Should verify the owners: ", async function () {
      console.log(await coin.minter());
      expect(await coin.minter()).to.equal(owners.address);
    });

    it("Should be able to mint tokens to the specified address by the minter.", async function () {
      const mintAmount = 100;
      await coin.mint(mintAmount);
      const ownerBalance = await coin.balances(owners.address);
      expect(ownerBalance.toString()).to.equal(mintAmount.toString());
    });

    it("Should fail if not the minter.", async function () {
      const mintAmount = 100;
      const initialMinterAmount = await coin.balances(nonMinterAddr);
      expect(coin.connect(nonMinterAddr).mint(mintAmount)).to.be.revertedWith(
        "Only minter can mint coins"
      );
      expect(await coin.balances(nonMinterAddr)).to.equal(initialMinterAmount);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between addresses", async function () {
      await coin.send(owners.address, nonMinterAddr, 50);
      const ownerssBalance = await coin.balances(owners.address);
      expect(ownerssBalance).to.equal(50);
      const receiversBalance = await coin.balances(nonMinterAddr);
      expect(receiversBalance).to.equal(50);
    });

    it("Should fail if the balance is not enough for the sender", async function () {
      await coin.mint(100);
      const amountTobeSent = 1000;
      const initialBalance = await coin.balances(owners.address);
      console.log(initialBalance.toString());
      await expect(coin.send(owners.address, nonMinterAddr, amountTobeSent))
        .to.be.revertedWithCustomError(coin, "InsufficientBalance")
        .withArgs(amountTobeSent, initialBalance);
    });

    it("Should emit the send event if the transaction succeeds", async function () {
      await expect(coin.send(owners.address, nonMinterAddr, 50))
        .to.emit(coin, "Send")
        .withArgs(owners.address, nonMinterAddr, 50);
    });

    it("Should get the balance for the address", async function () {
      await coin.mint(1000);
      expect(await coin.getBalance(nonMinterAddr)).to.equal(
        await coin.balances(nonMinterAddr)
      );
      expect(await coin.getBalance(owners.address)).to.equal(
        await coin.balances(owners.address)
      );
    });
  });
});
