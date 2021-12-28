# Lisa Studio

/**
 /$$      /$$$$$$ /$$$$$$  /$$$$$$         /$$$$$$ /$$$$$$$$/$$   /$$/$$$$$$$ /$$$$$$ /$$$$$$ 
| $$     |_  $$_//$$__  $$/$$__  $$       /$$__  $|__  $$__| $$  | $| $$__  $|_  $$_//$$__  $$
| $$       | $$ | $$  \__| $$  \ $$      | $$  \__/  | $$  | $$  | $| $$  \ $$ | $$ | $$  \ $$
| $$       | $$ |  $$$$$$| $$$$$$$$      |  $$$$$$   | $$  | $$  | $| $$  | $$ | $$ | $$  | $$
| $$       | $$  \____  $| $$__  $$       \____  $$  | $$  | $$  | $| $$  | $$ | $$ | $$  | $$
| $$       | $$  /$$  \ $| $$  | $$       /$$  \ $$  | $$  | $$  | $| $$  | $$ | $$ | $$  | $$
| $$$$$$$$/$$$$$|  $$$$$$| $$  | $$      |  $$$$$$/  | $$  |  $$$$$$| $$$$$$$//$$$$$|  $$$$$$/
|________|______/\______/|__/  |__/       \______/   |__/   \______/|_______/|______/\______/                                                                                                     
          ____ 
        o$%$$$$,    
      o$$%$$$$$$$.  
     $'-    -:$$$$b   
    $'         $$$$  
   d$.-=. ,==-.:$$$b  
   >$ `~` :`~' d$$$$   
   $$         ,$$$$$   
   $$b. `-~  ':$$$$$  
   $$$b ~==~ .:$$$$$ 
   $$$$$o--:':::$$$$      
   `$$$$$| :::' $$$$b  
   $$$$^^'       $$$$b  
  d$$$           ,%$$$b.   
 d$$%            %%%$--'-.  
/$$:.__ ,       _%-' ---  -  
    '''::===..-'   =  --.
 */

With most NFT platforms on the market today, creator's don't actually own the smart contract they are minting their NFTs on. If you just upload pngs to opensea, opensea retains admin privelidge of that smart contract. In an ideal world, creators would have complete control over their own NFTs, and their own smart contracts.

This is an early MVP, weekend hack project, to build out a Factory smart contract, that deploys other proxy ERC721 contracts. The UI allows users to deploy their own NFT contracts without needing to know how to code.

Similar to https://www.manifold.xyz/. This could grow into a "Shopfiy for NFTs". 

Deployed on rinkeby testet.

Checkout the smart contracts at:
- https://github.com/Keats0206/lisa-contracts

To clone the project:
```shell
git clone
yarn install
yarn dev && yarn build
```
