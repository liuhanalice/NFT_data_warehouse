import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import 'bootstrap/dist/css/bootstrap.min.css'

const pinataGatewayToken = process.env.pinataGatewayToken;
import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../build/contracts/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
     const provider = typeof window !== 'undefined' && window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : new ethers.providers.JsonRpcProvider('http://localhost:7545');
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const fullUri = `${tokenUri}${pinataGatewayToken}`
      try{
        const meta = await axios.get(fullUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: fullUri,
          name: i.name,
          description: i.description,
        }
        return item
      } catch (error){
        console.log(error)
      }
   })) 
    setNfts(items)
    setLoadingState('loaded') 
    }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.purchaseNFT(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (<div className="flex justify-center"><h1 className="px-20 py-10 text-3xl">No Items in Marketplace</h1></div>)
  return (
    <div className="container">
     <div className="p-4">
          <h2 className="text-2xl py-2">Items Listed For Sale: {nfts.length}</h2>
          {nfts.length > 0 && (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {nfts.map((nft, i) => (
                 <div key={i} className="text-center border shadow rounded-xl overflow-hidden" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <img src={nft.image} className="img-thumbnail" />
                    <div className="p-2">  
                      <p className="text-2xl font-semibold"> {nft.name}</p>
                      <div style={{ height: '20px', overflow: 'hidden' }}>
                        <p className="text-purple-400">{nft.description}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-black">
                      <p className="text-2xl font-bold text-white">Price: {nft.price} Eth</p>
                      <button onClick={() =>buyNft(nft)} className="font-bold mt-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded p-4 shadow-lg hover:shadow-2xl hover:from-blue-400 hover:to-purple-400 transition duration-300 ease-in-out">BUY</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
    </div>
  )
}
