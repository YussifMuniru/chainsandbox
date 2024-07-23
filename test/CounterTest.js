const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Counter", function () {
  let counter;
  before(async function () {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
  });

  it("Initial counter is equal to 0", async function () {
    expect(await counter.get()).to.equal(0);
  });

  it("Incrementing counter really increases the counter.", async function () {
    await counter.inc();
    expect(await counter.get()).to.equal(1);
  });
  it("Decrementing counter really decreases the counter.", async function () {
    await counter.dec();
    expect(await counter.get()).to.equal(0);
  });
});
