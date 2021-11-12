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
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
};

function useWeb3() {
  const [modal, setModal] = useState(null); // Web3Modal
  const [address, setAddress] = useState(null); // ETH address
  const [signer, setSigner] = useState(null); // ETH address
  const [editionId, setEditionID] = useState(null); // ETH address
  const [web3Provider, setWeb3Provider] = useState(null); // ETH address

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

    console.log(factoryContract);

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

    var editionMetadata = {
      name: "Warhol Print #3",
      symbol: "WAR",
      description: "This is an ongoing series of Warhol Prints available only on Rinkeby Testnet",
      imageUrl:
        "https://ipfs.io/ipfs/QmVZxPPTSD8A8ZBNCk9Gv444oHtyx7jU8mnETd25UUZtU1",
      editionSize: 11,
      royaltyBPS: 10,
    };

    // Sent transaction and return newID of Edition NFT contract
    const newID = await factoryContract.createEdition(
      editionMetadata.name,
      editionMetadata.symbol,
      editionMetadata.description,
      "",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      editionMetadata.imageUrl,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      // 1% royalty since BPS
      editionMetadata.editionSize,
      editionMetadata.royaltyBPS
    );
  };

  const getEditionURIs = async () => {
    // const minterAddress = "0xcc09cd3bc6576c28ce397d83d1dcb0e7bf149dda"

    // Warhol First Address
    // const minterAddress = "0xf02acd6b2c34ea83bd839c66b51bc7be17c18aba"

    // Warhol Second Address
    // const minterAddress = "0xe7283fe42dc876e1d8bc48c99efb54468f6d23ed"

    // Warhol Third Address
    const minterAddress = "0xaf0aef35b61705189a59374608de9100a1b96c4c"

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
    const minterAddress = "0xaf0aef35b61705189a59374608de9100a1b96c4c"
    const minterABI = require("../contracts/abi/minter.json");
    
    const mintingContract = new ethers.Contract(
      minterAddress,
      minterABI.abi,
      signer
    );

    const salePrice = ethers.utils.parseEther("0.08");

    try {
      await mintingContract.setSalePrice(salePrice);
      console.log("Succesfully set sale price to:" + salePrice)
    } catch {
      console.log("Sheeeeeeeeesh")
    }
  };

  const getTotalSupply = async (mintContractAddress) => {
    const minterABI = require("../contracts/abi/minter.json");
    
    const mintingContract = new ethers.Contract(
      mintContractAddress,
      minterABI.abi,
      signer
    );

    try {
      let supply = await mintingContract.totalSupply();
      console.log(supply);
      return supply.toNumber();
    } catch {
      console.log("error");
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
      await mintingContract.purchase({ value: ethers.utils.parseEther("0.08") });
      console.log("Succesfully purchased" + salePrice)
    } catch {
      console.log("Sheeeeeeeeesh")
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
    createEdition,
    editionId,
    getEditionURIs,
    setSalePrice,
    purchaseEdition,
    getTotalSupply
  };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;
