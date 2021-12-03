import { useState, useEffect } from "react";
import styles from "../styles/components/NFT.module.scss"; // Component styles

export default function NFTAdmin({ nft }) {
  return (
    <div className={styles.container}>
      <div>
        {/* Video Player */}
        <div>React Player</div>
        {/* NFT name, description and symbol */}
        <div>
          <div>
            {nft.name} {nft.symbol}
          </div>
        </div>
        {/* Balance in contract & withdraw */}

        {/* Set sale price */}
      </div>
    </div>
  );
}
