import Web3Modal from "web3modal"; // Web3Modal
import { ethers, providers } from "ethers"; // Ethers
import { useState, useEffect } from "react"; // State management
import { createContainer } from "unstated-next"; // Unstated-next containerization
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnectProvider (Web3Modal)

// Web3Modal provider options
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Inject Infura
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID_RINKEBY,
    },
  },
};

function useWeb3() {
  const [modal, setModal] = useState(null); // Web3Modal
  const [address, setAddress] = useState(null); // ETH address
  const [signer, setSigner] = useState(null); // ETH address
  const [editionId, setEditionID] = useState(null); // ETH address
  const [web3Provider, setWeb3Provider] = useState(null); // ETH address
  const [network, setNetwork]= useState(""); // Set Network

  /**
   * Setup Web3Modal on page load (requires window)
   */
  const setupWeb3Modal = () => {
    // Creaste new web3Modal
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
      providerOptions: providerOptions,
    });
    // Set web3Modal
    setModal(web3Modal);
  };  

  // Creating infura provider for dApp connection
  let infura = new ethers.providers.InfuraProvider('rinkeby'); 
  
  /**
   * Authenticate and store necessary items in global state
   */
  const authenticate = async () => {
    // Initiate web3Modal
    const web3Provider = await modal.connect();
    await web3Provider.enable();
    // Generate ethers provider
    const provider = new providers.Web3Provider(web3Provider);
    setWeb3Provider(provider);
    // Set active network
    const network = await provider.getNetwork();
    setNetwork(network.name)
    // Collect address
    const signer = provider.getSigner();
    setSigner(signer);
    const address = await signer.getAddress();
    setAddress(address);
  };

  const createEdition = async () => {
    // const web3 = createAlchemyWeb3(API_URL);
    var contract = require("../contracts/abi/factory.json");
    // Rinkeby address
    var contractAddress = "0x85FaDB8Debc0CED38d0647329fC09143d01Af660";
    // Create ethers connection to factory contract
    var factoryContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );

    // Set up metadata of Edition:
    
    /// @param _name Name of the edition contract
    /// @param _symbol Symbol of the edition contract
    /// @param _description Metadata: Description of the edition entry
    /// @param _animationUrl Metadata: Animation url (optional) of the edition entry
    /// @param _animationHash Metadata: SHA-256 Hash of the animation (if no animation url, can be 0x0)
    /// @param _imageUrl Metadata: Image url (semi-required) of the edition entry
    /// @param _imageHash Metadata: SHA-256 hash of the Image of the edition entry (if not image, can be 0x0)
    /// @param _editionSize Total size of the edition (number of possible editions)
    /// @param _royaltyBPS BPS amount of royalty

    // var editionMetadata = {
    //   name: "Petes First NFT",
    //   symbol: "PETE",
    //   description: "Petes first nft collection edition on Zora",
    //   imageUrl:
    //     "https://ipfs.io/ipfs/bafybeidkdpddccwhvtlliwj4kddr3xuqyrem2uszvg3pfrvdgc5kdwxqpq",
    //   editionSize: 11,
    //   royaltyBPS: 11,
    // };

    // var editionMetadata = {
    //   name: "Gemini",
    //   symbol: "11LIT3S",
    //   description:
    //     "Gemini nft drop from 11 LIT3S artist - part 1 of the ongoing series of 6 up coming NFT drops",
    //   animationUrl:
    //     "https://ipfs.io/ipfs/QmX13sSh8VqmAsgCwdMegj2ZhNQFPUbwifF944gFHhVTr8",
    //   editionSize: 11,
    //   royaltyBPS: 1000,
    // };

    var editionMetadata = {
      name: "Your Silence",
      symbol: "11LIT3S",
      description:
        "Your silence nft drop from 11 LIT3S artist - part 2 of the ongoing series of 6 up coming NFT drops",
      animationUrl:
        "https://ipfs.io/ipfs/QmSiz6WSTn4hZ6q76R1F8NUtoRuqRxfrbEHL28tsex7J4p",
      editionSize: 11,
      royaltyBPS: 1000,
    };

    try {
      const tx = await factoryContract.createEdition(
        editionMetadata.name,
        editionMetadata.symbol,
        editionMetadata.description,
        editionMetadata.animationUrl,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        // 10% royalty
        editionMetadata.editionSize,
        editionMetadata.royaltyBPS
      );
      console.log(tx);
      return {
        result: true,
        message:
        "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + tx.hash,
      };
    } catch (error) {
      return {
        result: false,
        message: "😥 Something went wrong: " + error.message,
      };
    }
  };

  const getEditionURIs = async () => {
    // const minterAddress = "0xcc09cd3bc6576c28ce397d83d1dcb0e7bf149dda"

    // Warhol First Address
    // const minterAddress = "0xf02acd6b2c34ea83bd839c66b51bc7be17c18aba"

    // Warhol Second Address
    // const minterAddress = "0xe7283fe42dc876e1d8bc48c99efb54468f6d23ed"

    // Warhol Third Address
    const minterAddress = "0xaf0aef35b61705189a59374608de9100a1b96c4c";

    const minterABI = require("../contracts/abi/minter.json");

    const mintingContract = new ethers.Contract(
      minterAddress,
      minterABI.abi,
      signer
    );
    // Confirm contract meta data
    const data = await mintingContract.getURIs();
  };

  const setSalePrice = async () => {
    const minterAddress = "0xaf0aef35b61705189a59374608de9100a1b96c4c";
    const minterABI = require("../contracts/abi/minter.json");

    const mintingContract = new ethers.Contract(
      minterAddress,
      minterABI.abi,
      signer
    );

    const salePrice = ethers.utils.parseEther("0.08");

    try {
      await mintingContract.setSalePrice(salePrice);
      console.log("Succesfully set sale price to:" + salePrice);
    } catch {
      console.log("Sheeeeeeeeesh");
    }
  };

  const getTotalSupply = async (mintContractAddress) => {
    const provider = new ethers.providers.JsonRpcProvider()

    const minterABI = require("../contracts/abi/minter.json");

    const mintingContract = new ethers.Contract(
      mintContractAddress,
      minterABI.abi,
      infura
    );

    try {
      let supply = await mintingContract.totalSupply();
      console.log(supply);
      return supply.toNumber();
    } catch {
      console.log("Couldn't get supply!");
    }
  };

  const purchaseEdition = async (mintContractAddress) => {
    const minterABI = require("../contracts/abi/minter.json");

    const mintingContract = new ethers.Contract(
      mintContractAddress,
      minterABI.abi,
      signer
    );

    const salePrice = ethers.utils.parseEther("0.08");

    try {
      await mintingContract.purchase({
        value: ethers.utils.parseEther("0.08"),
      });
      console.log("Succesfully purchased" + salePrice);
    } catch {
      console.log("Sheeeeeeeeesh");
    }
  };

  const checkCached = () => {
    if (modal?.cachedProvider) {
      authenticate();
    }
  };

  // On load events
  useEffect(setupWeb3Modal, []);
  useEffect(checkCached, [modal]);

  return {
    address,
    authenticate,
    network,
    createEdition,
    editionId,
    getEditionURIs,
    setSalePrice,
    purchaseEdition,
    getTotalSupply,
  };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;
