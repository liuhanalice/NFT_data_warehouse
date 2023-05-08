
/* test/sample-test.js */
const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarketplace", accounts => {
  // Test that the smart contract can create a new NFT
  it("should create a new NFT", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
    let listingPrice = await nftMarketplace.getListingPrice();
    listingPrice = listingPrice.toString();
    // Define input values
    const nftId = '1';
    const nftName = 'NFT1';
    const nftDescription = 'This is NFT1!';

    // Call the createToken function
    await nftMarketplace.createNFT("https://www.mytokenlocation.com", nftId, nftName, nftDescription, { from: accounts[0] });

    // Get the NFT details from the contract
    const nft = await nftMarketplace.getNFT(nftId);

    // Assert that the NFT was created with the correct properties
    assert.equal(nft.tokenId, nftId, "NFT id does not match");
    assert.equal(nft.seller, accounts[0], "NFT seller does not match");
    assert.equal(nft.owner, accounts[0], "NFT owner does not match");
    assert.equal(nft.price, 0, "NFT price does not match");
    assert.equal(nft.forSale, false, "NFT is listed for sale");
    assert.equal(nft.name, nftName, "NFT name does not match");
    assert.equal(nft.description, nftDescription, "NFT description does not match");

    const numTokens = await nftMarketplace.getNumtokens();
    assert.equal(numTokens, 1, "Number of tokens incorrect");
    // Fetch current unlisted item
    const unlistedItems = await nftMarketplace.fetchItemsUnListed();
    assert.isAbove(unlistedItems.length, 0, "Unlisted For Sale items should not be empty");
  });

   // Test that the smart contract can transfer ownership of an NFT
   it("should transfer ownership of an NFT", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
    const user1 = accounts[0];
    const user2 = accounts[1];
    // Create a new NFT with the first user account
    const nftId = 2;
    const nftname = "NFT2";
    const nftdescription = "This is NFT2!";
    await nftMarketplace.createNFT("https://www.mytokenlocation2.com", nftId, nftname, nftdescription, { from: user1 });
    const nft = await nftMarketplace.getNFT(nftId);
    assert.equal(nft.owner, accounts[0], "NFT owner does not match");

    // Transfer ownership of the NFT to the second user account using the transferNFT function
    await nftMarketplace.transferNFT(user1, nftId, { from: user2 });

    // Assert that the NFT is now owned by the second user account
    const ownerOfNFT = await nftMarketplace.ownerOf(nftId);
    assert.equal(ownerOfNFT, user2, "Ownership was not transferred successfully");
  });

  // Test that the smart contract can list an NFT for sale:
  it("should list an NFT for sale", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
    const user1 = accounts[0];
    // Create a new NFT with the user account
    const nftId = 3;
    const nftname = "My NFT3";
    const nftdescription = "This is NFT3!";
    const salePrice = web3.utils.toWei("1", "ether");
    await nftMarketplace.createNFT("https://www.mytokenlocation3.com", nftId, nftname, nftdescription, { from: user1 });

    // List the NFT for sale using the sellNFT function with sale price
    await nftMarketplace.listNFTForSale(nftId, salePrice, { from: user1, value: web3.utils.toWei("0.00025", "ether")});

    // Assert that the NFT is now listed for sale and its sale price matches the input value
    const nft = await nftMarketplace.getNFT(nftId);
    assert.equal(nft.forSale, true, "NFT is not listed for sale");
    assert.equal(nft.price, salePrice, "NFT sale price does not match input value");
    
    // Fetch current listed item
    const unlistedItems = await nftMarketplace.fetchItemsListed();
    assert.isAbove(unlistedItems.length, 0, "Listed For Sale items should not be empty");
  });

  // Test that the smart contract can remove an NFT from sale
  it("should remove an NFT from sale", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
    const user1 = accounts[0];
    // Create a new NFT with the user account
    const nftId = 4;
    const nftname = "NFT4";
    const nftdescription = "This is NFT4!";
    const salePrice = web3.utils.toWei("1", "ether");
    await nftMarketplace.createNFT("https://www.mytokenlocation4.com", nftId, nftname, nftdescription, { from: user1 });

    // List the NFT for sale using the sellNFT function with sale price
    await nftMarketplace.listNFTForSale(nftId, salePrice, { from: user1, value: web3.utils.toWei("0.00025", "ether")});

    // Remove the NFT from sale using the removeNFTFromSale function
    await nftMarketplace.removeNFTFromSale(nftId, { from: user1 });

    // Assert that the NFT is no longer listed for sale
    const nft = await nftMarketplace.getNFT(nftId);
    assert.equal(nft.forSale, false, "NFT is still listed for sale");

    // Assert that the owner of NFT is the user
    assert.equal(nft.owner, user1, "NFT ownership not returned to user");
  });

   // Test that the smart contract can execute a successful NFT purchase
   it("should purchase NFT", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
    // mint a new NFT
    // const [owner, seller, buyer] = await web3.eth.getAccounts();
    const owner = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];

    const nftId = 5;
    const nftname = "NFT5";
    const nftdescription = "This is NFT5!";
    const salePrice = web3.utils.toWei("1", "ether");
    await nftMarketplace.createNFT("https://www.mytokenlocation5.com", nftId, nftname, nftdescription, { from: seller });

    // List the NFT for sale using the sellNFT function with sale price
    await nftMarketplace.listNFTForSale(nftId, salePrice, { from: seller, value: web3.utils.toWei("0.00025", "ether")});

    // get the initial balances of the accounts
    const ownerBalanceBefore = await web3.eth.getBalance(owner);
    const buyerBalanceBefore = await web3.eth.getBalance(buyer);
    const sellerBalanceBefore = await web3.eth.getBalance(seller);

    // purchase the NFT
    const purchase = await nftMarketplace.purchaseNFT(nftId, { from: buyer, value: salePrice});
    const gasUsed = purchase.receipt.gasUsed;
    const tx = await web3.eth.getTransaction(purchase.tx);
    const gasPrice = tx.gasPrice;

    // check that the ownership of the NFT has been transferred to the buyer account
    const ownerAfter = await nftMarketplace.ownerOf(nftId);
    assert.equal(ownerAfter, buyer, "ownership not transferred to buyer");

    // check that the NFT is no longer listed for sale
    const nft = await nftMarketplace.getNFT(nftId);
    assert.equal(nft.forSale, false, "NFT still listed for sale");

    // check that the commission percentage has been transferred to the contract owner
    const ownerBalanceAfter = await web3.eth.getBalance(owner);
    const commission = web3.utils.toWei("0.00025", "ether");
    
    assert.equal(ownerBalanceAfter.toString(), web3.utils.toBN(ownerBalanceBefore).add(web3.utils.toBN(commission)).toString(), "commission not transferred to contract owner");


    // // check that the correct amount of Ether has been transferred to the seller
    const sellerBalanceAfter = await web3.eth.getBalance(seller);
    //const amount = salePrice;
    assert.equal(web3.utils.toBN(sellerBalanceAfter).sub(web3.utils.toBN(sellerBalanceBefore)).toString(), web3.utils.toBN(salePrice).toString(), "incorrect amount transferred to seller");

    // // check that the correct amount of Ether has been deducted from the buyer's balance
    const buyerBalanceAfter = await web3.eth.getBalance(buyer);
    assert.equal(buyerBalanceAfter.toString(), web3.utils.toBN(buyerBalanceBefore).sub(web3.utils.toBN(salePrice)).sub(web3.utils.toBN(gasUsed).mul(web3.utils.toBN(gasPrice))).toString(), "incorrect amount deducted from buyer's balance");
  });
  it("should not reentracy", async () => {
   
  });

  // Test that the smart contract can execute an unsuccessful NFT purchase
  it("should execute an unsuccessful NFT purchase", async () => {
    const nftMarketplace = await NFTMarketplace.deployed();
    // mint a new NFT
    const owner = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];

    const nftId = 6;
    const nftname = "NFT6";
    const nftdescription = "This is NFT6!";
    const salePrice = web3.utils.toWei("1", "ether");
    await nftMarketplace.createNFT("https://www.mytokenlocation6.com", nftId, nftname, nftdescription, { from: seller });

    // List the NFT for sale using the sellNFT function with sale price
    await nftMarketplace.listNFTForSale(nftId, salePrice, { from: seller, value: web3.utils.toWei("0.00025", "ether")});
    const ownerBefore = await nftMarketplace.ownerOf(nftId);

    // get the initial balances of the accounts
    const ownerBalanceBefore = await web3.eth.getBalance(owner);
    const buyerBalanceBefore = await web3.eth.getBalance(buyer);
    const sellerBalanceBefore = await web3.eth.getBalance(seller);

    // Attempt to purchase the NFT with an incorrect amount of Ether
    try {
      await nftMarketplace.purchaseNFT(nftId, { from: buyer, value: web3.utils.toWei("0.5", "ether") });
    } catch (error) {
      assert.equal(error.reason, "Please submit the asking price in order to complete the purchase");
    }

    // check that the NFT ownership remains with the first user account
    const ownerAfter = await nftMarketplace.ownerOf(nftId);
    assert.equal(ownerAfter, ownerBefore, "ownership is transferred to buyer");

    // // check that the NFT is still listed for sale
    const nft = await nftMarketplace.getNFT(nftId);
    assert.equal(nft.forSale, true, "NFT is not listed for sale");

    // check that no commission was transferred to the contract owner
    const ownerBalanceAfter = await web3.eth.getBalance(owner);
    const commission = web3.utils.toWei("0", "ether");
    assert.equal(ownerBalanceAfter - ownerBalanceBefore, commission, "commission is transferred to contract owner");

    // check that no Ether was transferred to the seller
    const sellerBalanceAfter = await web3.eth.getBalance(seller);
    const amount = web3.utils.toWei("0", "ether");
    assert.equal(sellerBalanceAfter - sellerBalanceBefore, amount, "ether transferred to seller");

    // check that no Ether has was deducted from the buyer's balance
    const buyerBalanceAfter = await web3.eth.getBalance(buyer);
    assert.equal(buyerBalanceBefore - buyerBalanceAfter, web3.utils.toWei("0", "ether"), "ether transferred from buyer");
  });

});
