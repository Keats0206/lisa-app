import Head from "next/head"; // HTML Head
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../styles/components/NFT.module.scss"; // Component styles
import { web3 } from "../containers/index"; // Web3 container
import { Parallax } from "react-scroll-parallax";

export default function NFT({ nft }) {
  const { address, getTotalSupply, purchaseEdition } = web3.useContainer();
  const [nftSupply, setNFTSupply] = useState(0);

  const handlePurchase = async () => {
    await purchaseEdition(nft.contractAddress);
  };

  const getSupply = async () => {
    let supply = await getTotalSupply(nft.contractAddress);
    setNFTSupply(supply);
  };

  useEffect(() => {
    getSupply();
  }, [address, getSupply]);

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <Parallax className="custom-class" y={[-40, 40]} tagOuter="figure">
          <h1>{nft.name}</h1>
          <h3>{nft.symbol}</h3>
          <p>{nft.description}</p>
          <div>
            <h4>Edition Price:</h4>
            <h2>0.08 ETH</h2>
          </div>
          <div>
            <h4>NFTs Sold:</h4>
            <h2>
              {nftSupply} out of {nft.editionSize}
            </h2>
          </div>
          <button
            className={styles.nft__action_button_black}
            onClick={() => handlePurchase()}
          >
            Purchase Edition
          </button>
        </Parallax>
      </div>
      <div className={styles.media}>
        <div className={styles.image}>
          <Image
            src={nft.imageUrl}
            alt="Picture of the author"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
