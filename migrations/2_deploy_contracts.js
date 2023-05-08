var NFTMarketplace = artifacts.require("./NFTMarketplace.sol");
const fs = require('fs');

module.exports = function(deployer) {
  deployer.deploy(NFTMarketplace).then(async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
    console.log("nftMarketplace deployed to:", nftMarketplace.address);
    const configData = `export const marketplaceAddress = "${nftMarketplace.address}";\n`;
    fs.writeFileSync('config.js', configData);
  });
};