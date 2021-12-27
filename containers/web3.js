import Web3Modal from "web3modal"; // Web3Modal
import { ethers, providers } from "ethers"; // Ethers
import { useState, useEffect } from "react"; // State management
import { createContainer } from "unstated-next"; // Unstated-next containerization
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnectProvider (Web3Modal)
import { editions } from "../data/editions";

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
  const [nfts, setNfts] = useState(null); // Set Edition NFTs

  // Constants
  const creatorAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET;
  const factoryContractAddress = process.env.NEXT_PUBLIC_FACTORY_CONTRACT;
  const factoryABI = require("../contracts/abi/factory.json");
  const minterABI = require("../contracts/abi/minter.json");

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
  const fetchEditions = async () => {
    const editionNFTs = [];
    // Create ethers connection to factory contract
    var factoryContract = new ethers.Contract(
      factoryContractAddress,
      factoryABI.abi,
      infura
    );

    const eventFilter = factoryContract.filters.CreatedEdition(
      null,
      creatorAddress
    );

    const events = await factoryContract.queryFilter(eventFilter);

    // Returns a single NFT, useful for testing

    // const editionAddress = events[1].args.editionContractAddress;
    // var edition = await createNFTfromContractAddress(editionAddress);
    // editionNFTs.push(edition);

    for (let i = 0; i < events.length; i++) {
      // for each contract address call the create nft function
      const editionAddress = events[i].args.editionContractAddress;
      var edition = await createNFTfromContractAddress(editionAddress);
      editionNFTs.push(edition);
    }
    setNfts(editionNFTs);
    return;
  };

  useEffect(fetchEditions, []);

  // Creating NFT Object for the webapp
  const createNFTfromContractAddress = async (contractAddress) => {
    var editionContract = new ethers.Contract(
      contractAddress,
      minterABI.abi,
      infura
    );

    try {
      const name = await editionContract.name();
      const symbol = await editionContract.symbol();
      // const description = await editionContract.description(); //No getter for description at the moment
      // Supplementing description with manual data for now
      const description =
        name == "GEMINI" ? editions[0].description : editions[1].description;
      const owner = await editionContract.owner();
      const salePrice = await editionContract.salePrice();
      const editionSize = await editionContract.editionSize();
      const uris = await editionContract.getURIs(); // array of content URIs
      const totalSupply = await editionContract.totalSupply();
      let nftEdition = {
        contractAddress: contractAddress,
        name: name,
        symbol: symbol,
        description: description,
        owner: owner,
        salePrice: ethers.utils.formatEther(salePrice),
        editionSize: editionSize.toString(),
        uris: uris, // array of content URIs
        totalSupply: totalSupply.toString(),
        // Zora has no testnet, so this will only work on Mainnet
        directLink: "https://zora.co/collections/" + contractAddress,
      };
      return nftEdition;
    } catch (error) {
      console.log(error);
    }
  };

  const getContractRoyaltyInfo = async (contractAddress, salePrice) => {
    var editionContract = new ethers.Contract(
      contractAddress,
      minterABI.abi,
      infura
    );

    try {
      // Passing in 0 token Id, 100 for sale price to return % result used in frontend.
      const royalty = await editionContract.royaltyInfo(0, 100);
      const royaltyInfo = {
        receiver: royalty.receiver,
        amount: royalty.royaltyAmount.toNumber(),
      };
      return royaltyInfo;
    } catch (error) {
      console.log(error);
    }
  };

  /// @param _name Name of the edition contract
  /// @param _symbol Symbol of the edition contract
  /// @param _description Metadata: Description of the edition entry
  /// @param _animationUrl Metadata: Animation url (optional) of the edition entry
  /// @param _animationHash Metadata: SHA-256 Hash of the animation (if no animation url, can be 0x0)
  /// @param _imageUrl Metadata: Image url (semi-required) of the edition entry
  /// @param _imageHash Metadata: SHA-256 hash of the Image of the edition entry (if not image, can be 0x0)
  /// @param _editionSize Total size of the edition (number of possible editions)
  /// @param _royaltyBPS BPS amount of royalty (10 = 10%) multiply by 100 in call

  const createEdition = async (
    name,
    symbol,
    description,
    previewImageUrl,
    animationUrl,
    editionSize,
    royaltyBPS
  ) => {
    // Create ethers connection to factory contract
    var factoryContract = new ethers.Contract(
      factoryContractAddress,
      factoryABI.abi,
      signer
    );

    // Adjusting royalty BPS by factor of 100. 1000 passed into the function below equals 10% royalty.
    const adjustedRoyalty = royaltyBPS * 100;

    // Set up metadata of Edition:
    try {
      const tx = await factoryContract.createEdition(
        name,
        symbol,
        description,
        previewImageUrl,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        animationUrl,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        editionSize,
        adjustedRoyalty
      );
      return {
        result: true,
        message:
          "Succesfully created edition, set a price for the NFT to be purchased!",
      };
    } catch (error) {
      return {
        result: false,
        message: "Transaction failed, try again!",
      };
    }
  };

  const purchaseEdition = async (mintContractAddress, salePrice) => {
    const mintingContract = new ethers.Contract(
      mintContractAddress,
      minterABI.abi,
      signer
    );

    const price = ethers.utils.parseEther(salePrice);

    try {
      const tx = await mintingContract.purchase({
        value: price,
      });
      return {
        result: true,
        message:
          "Succesfully purchased NFT! Patience, blockchain can be slow. The NFT will be in your wallet soon!",
      };
    } catch (error) {
      if (error.code == "INSUFFICIENT_FUNDS") {
        return {
          result: false,
          message: "Insufficient funds in your wallet!",
        };
      } else {
        return {
          result: false,
          message: "Oops, transaction failed. Try again!",
        };
      }
    }
  };

  // Modify Set Sale Price to take in Contract Address
  const setSalePrice = async (mintContractAddress, price) => {
    const mintingContract = new ethers.Contract(
      mintContractAddress,
      minterABI.abi,
      signer
    );

    const salePrice = ethers.utils.parseEther(price);

    try {
      const tx = await mintingContract.setSalePrice(salePrice);
      return {
        result: true,
        message: "Succesfully changed sale price!",
      };
    } catch (error) {
      return {
        result: false,
        message: "Transaction failed, try again!",
      };
    }
  };

  const getSalePrice = async (mintContractAddress) => {
    const mintingContract = new ethers.Contract(
      mintContractAddress,
      minterABI.abi,
      infura
    );

    try {
      let price = await mintingContract.salePrice();
      return ethers.utils.formatEther(price);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalSupply = async (mintContractAddress) => {
    const minterABI = require("../contracts/abi/minter.json");

    const mintingContract = new ethers.Contract(
      mintContractAddress,
      minterABI.abi,
      infura
    );

    try {
      let supply = await mintingContract.totalSupply();
      return supply.toNumber();
    } catch {
      console.log("Couldn't get supply!");
    }
  };

  // Handle a null balance...
  const getContractBalance = async (contractAddress) => {
    try {
      const balance = await infura.getBalance(contractAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.log("Error retrieveing balance");
    }
  };

  const withdrawEditionBalance = async (contractAddress) => {
    const minterABI = require("../contracts/abi/minter.json");

    const mintingContract = new ethers.Contract(
      contractAddress,
      minterABI.abi,
      signer
    );

    try {
      const tx = await mintingContract.withdraw();
      return {
        result: true,
        message: "Successfully withdrew ETH",
      };
    } catch (error) {
      return {
        result: false,
        message: "Something went wrong, try again!",
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
    nfts,
    networkName,
    activeNetwork,
    createEdition,
    setSalePrice,
    purchaseEdition,
    getTotalSupply,
    getSalePrice,
    getContractBalance,
    withdrawEditionBalance,
    fetchEditions,
    createNFTfromContractAddress,
    getContractRoyaltyInfo,
  };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;
