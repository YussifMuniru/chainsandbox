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
      expect(await coin.minter()).to.equal(owners.address);
    });

    it("Should be able to mint tokens to the specified address by the minter.", async function () {
      const mintAmount = 100;
      await coin.mint(coin.minter(), mintAmount);
      console.log(
        "This is the balance: "
      );
      const ownerBalance = await coin.balances[coin.minter()];
      expect(ownerBalance).to.equal(mintAmount);
    });

    it("Should fail if not the minter.", async function () {
      const mintAmount = 100;
      expect(
        coin.connect(nonMinterAddr).mint(nonMinterAddr, mintAmount)
      ).to.be.revertedWith("Only minter can mint coins");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between addresses", async function () {
      await coin.send(nonMinterAddr, 50);

      const ownerssBalance = await coin.balances[owners.address];
      expect(ownerssBalance).to.equal(50);

      const receiversBalance = await coin.balances[nonMinterAddr];
      expect(receiversBalance).to.equal(50);
    });

    it("Should fail if the balance is not enough for the sender", async function () {
      const initialBalance = await coin.balances[owners.address];
      await expect(coin.send(nonMinterAddr, 1000)).to.be.revertedWith(
        "InsufficientBalance"
      );
      expect(await coin.balances[owners.address]).to.equal(initialBalance);
    });

    it("Should emit the send event if the transaction succeeds", async function () {
      await expect(coin.send(nonMinterAddr, 50))
        .to.emit(coin, "Send")
        .withArgs(nonMinterAddr, 50);
    });
  });
});
