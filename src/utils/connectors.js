import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { ethers } from "ethers";

const IS_MAINNET = process.env.REACT_APP_NETWORK === 'mainnet';
const NETWORK_NAME = IS_MAINNET ? "bsc": "bsc test ";
const chainId = IS_MAINNET? 56 : 97;
const rpcUrl = IS_MAINNET? "https://bsc-dataseed.binance.org/" : "https://data-seed-prebsc-1-s1.binance.org:8545/";
const scanUrl = IS_MAINNET? "https://bscscan.com" : "https://testnet.bscscan.com";
const CHAIN_IDS = [1, 4, 56, 97];

const RPC_URL = {
  1: 'https://apis.ankr.com/07d6d9e39e544222b723433bbf80ba1e/87f9b1b6a1f859c4fbaddc54b491e60e/eth/fast/main', 
  4: 'https://apis.ankr.com/ad4e043332864e34afa50a01bc331435/87f9b1b6a1f859c4fbaddc54b491e60e/eth/fast/rinkeby',
  56: 'https://apis.ankr.com/71032cfb65a24b1996a4de52761ddd38/87f9b1b6a1f859c4fbaddc54b491e60e/binance/full/main',
  97: 'https://apis.ankr.com/c67d625b904f4b189faccb68bb1a1ba8/87f9b1b6a1f859c4fbaddc54b491e60e/binance/full/test'
};

const BINANCE_MAINNET_PARAMS = {
  chainId: chainId,
  chainName: "Binance",
  nativeCurrency: {
    name: "Binance",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: [rpcUrl],
  blockExplorerUrls: [scanUrl],
};

const injected = new InjectedConnector({ supportedChainIds: [chainId] });
const binance_wallet = new InjectedConnector({
  supportedChainIds:  [Number(BINANCE_MAINNET_PARAMS.chainId)],
});
const trustWallet = new InjectedConnector({
  supportedChainIds:  [Number(BINANCE_MAINNET_PARAMS.chainId)],
});

const walletConnect = new WalletConnectConnector({
  rpc: RPC_URL,
  qrcode: true,
  pollingInterval: 12000,
});

export const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export { injected, trustWallet, walletConnect, binance_wallet, chainId,  scanUrl, NETWORK_NAME};
