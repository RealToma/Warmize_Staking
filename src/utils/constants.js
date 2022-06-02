const IS_MAINNET = process.env.REACT_APP_NETWORK === 'mainnet';

const CONTRACTS = IS_MAINNET
  ? {
    WARMIZ_TOKEN: '0x9C8f9bdb032c0129Da74458a9C5CE93329973876',
    WARMIZ_STOKEN: '0xF1c69BB971B95595635cF82471313840F61F6c43'
  } : {
    WARMIZ_TOKEN: '0x77CC2b39BB859690208e64F4f3953f96B350A6FB',
    WARMIZ_STOKEN: '0x2f64B959ddb2cf257d4dC7A1Fa6d844232a4B887'
  }


const HTTP_PROVIDER_URL = IS_MAINNET ? "https://bsc-dataseed.binance.org/" : "https://data-seed-prebsc-1-s1.binance.org:8545/";

export {
  IS_MAINNET,
  CONTRACTS,
  HTTP_PROVIDER_URL
}