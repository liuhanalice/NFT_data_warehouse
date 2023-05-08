import { useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers'
import axios from "axios"
import Web3Modal from 'web3modal'

const JWT = process.env.JWT;

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../build/contracts/NFTMarketplace.json'

export default function CreateItem() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [formInput, updateFormInput] = useState({ name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    try {
      const file = e.target.files[0]
      setSelectedFile(file)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description } = formInput
    if (!name || !description || !selectedFile) return
    /* first, upload to IPFS */
    const formData = new FormData();
    formData.append('file', selectedFile)
    const metadata = JSON.stringify({
      name: name,
    });
    formData.append('pinataMetadata', metadata);
  
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data);
      const ipfsHash = res.data.IpfsHash;
      const url = `https://amber-necessary-guanaco-453.mypinata.cloud/ipfs/${ipfsHash}`;
      return {url, name, description}
    } catch (error) {
      console.log(error);
    }
  }

  async function listNFT() {
    const { url, name, description }= await uploadToIPFS().then(resp => {
  return resp ? resp : {};
  });
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    //const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    // let listingPrice = await contract.getListingPrice()
    // listingPrice = listingPrice.toString()
      try{
        if (!url) {
        console.log('Invalid URL')
        return
      }
      let transaction = await contract.createItem(url, name, description)
      await transaction.wait()
      router.push('/')
    } catch (error){
      console.log('Error')
    }
     
  }

  return (
    <div className="container">
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          selectedFile && (
            <img className="rounded mt-4" width="350" src={URL.createObjectURL(selectedFile)} />
          )
        }
        <button
  onClick={listNFT}
  className="font-bold mt-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded p-4 shadow-lg hover:shadow-2xl hover:from-blue-400 hover:to-purple-400 transition duration-300 ease-in-out"
>
          CREATE NFT
        </button>
        <div className='text-center mt-3'>
          <p style={{ color: "purple" }}>You can view your nfts in dashboard</p>
        </div>
      </div>
    </div>
    </div>
  )
}