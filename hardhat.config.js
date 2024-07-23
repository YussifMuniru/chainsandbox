require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    bscmainnet: {
      url: process.env.MAINNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 2000000000,
    },
    bsctestnet: {
      url: process.env.TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 2000000000,
    },
  },
  ignition: {
    module: require("./ignition/modules/Lock"),
  },
};
