require("@nomiclabs/hardhat-waffle");
const secret = require("./environment/secrets.json");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    sources: "./blockchain/contracts",
    tests: "./blockchain/test",
    cache: "./blockchain/cache",
    artifacts: "./src/blockchain/artifacts"
  },
  networks: {
    mumbai: {
      url: secret.mumbainode,
      accounts: [secret.privatekey],
    }
  },
};
