# Project: LION NFT Marketplace
## Introduction
This is an NFT Marketplace platform called **LION NFT Marketplace**, build with ERC-721 standard, Truffle, and Next.js. This Project was a final course project of Columbia University ELEN E6883: An Introduction to Blockchain Technology (spring 2023).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Test With Truffle and Ganache
To start, make sure to install truffle and Ganache.

First, install dependencies:

```bash
npm install
```
Then, run:
```bash
truffle test
```
<img width="586" alt="image" src="https://user-images.githubusercontent.com/30332629/236952357-fc3b6ab7-7f41-45b9-883e-91a19b0bbc28.png">

## Local Deployment
> **Note**
> We use [Pinata](https://www.pinata.cloud/) IPFS services, if you want to deploy our project, you need to create a Pinata account and may need to unlock "dedicated gateways" features (with an additional cost) to have the project work as expected. Alternatively, you can use other methods, but make sure to modify the code related to Pinata IPFS accordingly or the project cannot deploy successfully.

> **Note**
> If you want to use Pinata IPFS services as we did, you need to create an **.env:** file in the root folder. And paste your Pinata JWT to this file as well as your dedicated gateway access token. More details in [Pinata Docs](https://docs.pinata.cloud/).<img width="829" alt="envfile pic " src="https://user-images.githubusercontent.com/30332629/236955423-0e201a56-ed2c-484e-8373-138331e3cff8.png"> 
> 
> You also need to change the domain address [here](https://github.com/liuhanalice/nft-marketplace/blob/5984d799c1d95fe3da2d747aa44ef9ba8398f05b/pages/create-nft.js#L54) 

To compile and deploy to local host:

```bash
npm run local
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result. To test functionalities, be sure to have the [MetaMask](https://metamask.io/) digital wallet and enough funds. For local tests, you can use Ganache free accounts as we did.


## Testnet Deployment
We use [Remix IDE](https://remix.ethereum.org/) to deploy our project to Sepolia testnet. To do so, make sure to add your own Api key (INFURA_API_KEY) and MetaMask Secret Recovery Phrase (MNEMONIC) in the **.env** file.

## Front-end Walkthrough (localhost)

https://user-images.githubusercontent.com/30332629/236959911-31cb0ff2-7bd9-4351-ab2a-e74f9f0d951a.mov

## References
https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/tree/main

---


# NFTVerse Data Warehouse

## Overview:
NFTVerse Data Warehouse is a comprehensive NFT data storage and retrieval system that combines on-chain NFT transaction history, metadata, and off-chain NFT multimedia content such as images and videos stored on the InterPlanetary File System (IPFS). The project aims to provide an easy-to-use API for developers to build novel NFT applications and analytics tools to foster innovation and growth within the NFT ecosystem.

## Components:

### Data Collection:
The data collection module aggregates NFT transaction data and metadata from various blockchain networks (e.g., Ethereum, Binance Smart Chain, Solana) using their respective APIs. Off-chain NFT multimedia content is fetched from IPFS using the content hash provided in the metadata. Data is collected in real-time to ensure the most up-to-date information is available for developers.

### Data Processing:
Collected data is cleaned, validated, and enriched with additional details (e.g., token standard, NFT collection name) before being stored in the data warehouse. The data processing module also handles deduplication and normalization of the data across different blockchain networks to provide a unified view.

### Data Storage:
The data warehouse is built on a scalable and distributed database system optimized for handling large volumes of structured and semi-structured data. This system ensures low-latency queries and high availability for the APIs built on top of it.

### API Layer:
The API layer provides a suite of RESTful APIs for developers to access the data warehouse. It offers endpoints for querying NFT transaction history, metadata, and multimedia content, along with advanced search and filtering capabilities. The API layer also handles authentication and rate limiting to ensure fair usage and security.

### Documentation and Developer Portal:
A comprehensive documentation and developer portal is available to help developers understand the API usage, access sample code, and explore interactive API documentation. This portal also offers a community forum for developers to discuss ideas, ask questions, and share their NFT application projects.

## Possible Use Cases:

### NFT Analytics Platform:
Developers can create an analytics platform that tracks the performance of various NFT collections, marketplaces, and individual tokens, providing insights into trends, sales volume, and pricing.

### NFT Discovery and Recommendation Engine:
Using the data warehouse, developers can build a recommendation engine that helps users discover new NFTs based on their preferences, browsing history, and social network.

### NFT Portfolio Management:
Developers can create an NFT portfolio management app that allows users to track their NFT holdings, analyze their investments, and make informed decisions on buying or selling NFTs.

### NFT-based Gaming and Virtual Worlds:
The API can be used to develop novel gaming experiences and virtual worlds where users can showcase, trade, or interact with their NFTs in an immersive environment.

By providing a robust and comprehensive data warehouse solution for NFTs, the NFTVerse Data Warehouse project aims to fuel innovation and growth in the NFT ecosystem by offering developers a powerful toolset for creating cutting-edge NFT applications.
