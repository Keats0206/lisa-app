import { web3 } from "../containers/index"; // Web3 container

export const fetchEditions = async () => {
    const { fetchEditionsCreator } = web3.useContainer();
    let editions = await fetchEditionsCreator();    
    return editions;
};
