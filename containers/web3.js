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
  const [activeNetwork, setActiveNetwork] = useState(""); // Set Network (BOOL)
  const [networkName, setNetworkName] = useState(""); // Set Network (BOOL)
  const [contracts, setContracts] = useState(null); // Creator Contract Objects

  // Constants
  const factoryContractAddress = process.env.NEXT_PUBLIC_FACTORY_CONTRACT;
  const factoryABI = require("../contracts/abi/CreatorContractFactory.json");
  const minterABI = require("../contracts/abi/CreatorContract.json");

  /**
   * Setup Web3Modal on page load (requires window)
   */
  const setupWeb3Modal = () => {
    // Creaste new web3Modal
    const web3Modal = new Web3Modal({
      network: process.env.NEXT_PUBLIC_NETWORK,
      cacheProvider: true,
      providerOptions: providerOptions,
    });
    // Set web3Modal
    setModal(web3Modal);
  };

  // Creating infura provider for dApp connection
  let infura = new ethers.providers.InfuraProvider(
    process.env.NEXT_PUBLIC_NETWORK
  );

  /**
   * Authenticate and store necessary items in global state
   */
  const authenticate = async () => {
    // Initiate web3Modal
    const web3Provider = await modal.connect();
    await web3Provider.enable();
    // Generate ethers provider
    const provider = new providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();
    setSigner(signer);
    const address = await signer.getAddress();
    setAddress(address);
    const network = await provider.getNetwork();
    setNetworkName(network.name);
    console.log(network.name);
    // Checking active chain while user is authenticating
    if (network.name == process.env.NEXT_PUBLIC_NETWORK) {
      setActiveNetwork(true);
    } else {
      setActiveNetwork(false);
    }
  };

  // Checking active chain on load before user even authenticates
  const checkChain = async () => {
    if (address) {
      const web3Provider = await modal.connect();
      await web3Provider.enable();
      // Generate ethers provider
      const provider = new providers.Web3Provider(web3Provider);
      setWeb3Provider(provider);
      const network = provider.getNetwork();
      if (network.name == process.env.NEXT_PUBLIC_NETWORK) {
        setActiveNetwork(true);
      } else {
        setActiveNetwork(false);
      }
    } else {
      console.log("Error checking chain");
    }
  };

  useEffect(checkChain, []);

  // // Works but is missing the name, symbol and description
  const fetchCreatorContracts = async () => {
    const creatorContracts = [];
    // Create ethers connection to factory contract
    var factoryContract = new ethers.Contract(
      factoryContractAddress,
      factoryABI.abi,
      infura
    );

    const eventFilter = factoryContract.filters.CreatedContract(
      null,
      address
    );

    const events = await factoryContract.queryFilter(eventFilter);

    for (let i = 0; i < events.length; i++) {
      // for each contract address call the create nft function
      const creatorContractAddress = events[i].args.creatorContractAddress;
      var contractAddress = await sanitizeContractData(creatorContractAddress);
      creatorContracts.push(contractAddress);
    }
    setContracts(creatorContracts);
    return;
  };

  useEffect(fetchCreatorContracts, []);

  // 
  const sanitizeContractData = async (contractAddress) => {
    var creatorContract = new ethers.Contract(
      contractAddress,
      minterABI.abi,
      infura
    );

    try {
      const name = await creatorContract.name();
      const symbol = await creatorContract.symbol();
      let contract = {
        contractAddress: contractAddress,
        name: name,
        symbol: symbol
      };
      return contract;
    } catch (error) {
      console.log(error);
    }
  };

  /// @param _name Name of the creator contract
  /// @param _symbol Symbol of the creator contract
  const createCreatorNFTContract = async (name, symbol) => {
    // Create ethers connection to factory contract
    var factoryContract = new ethers.Contract(
      factoryContractAddress,
      factoryABI.abi,
      signer
    );

    try {
      const tx = await factoryContract.createCreatorContract(name, symbol);
      console.log(tx);
      return {
        result: true,
        message:
          "Succesfully created creator contract!",
        tx: tx.hash
      };
    } catch (error) {
      return {
        result: false,
        message: "Transaction failed, try again!",
      };
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
    networkName,
    activeNetwork,
    createCreatorNFTContract,
    contracts
  };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;
