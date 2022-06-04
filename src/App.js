import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { chainId, NETWORK_NAME } from "./utils/connectors";
import { injected, walletConnect, trustWallet, binance_wallet } from "./utils/connectors";
import { useWeb3React } from "@web3-react/core";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "./notifications.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from '@material-ui/core';
import { chainIds } from "./utils/chains";
import Topbar from "./layouts/topbar/topbar";
import Content from "./layouts/content/content";

const CURRENT_WALLET_STORAGE_NAME = "CurrentWalletConnect";
const DOCUMENT_TITLE = "WARMIZ STAKING APP";



function App() {
  const handleClose = () => setOpen(false);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const DESKTOP_CONNECTORS = {
    MetaMask: injected,
    WalletConnect: walletConnect,
    BinanceWallet: binance_wallet,
    TrustWallet: trustWallet,
  };


  const walletConnectors = DESKTOP_CONNECTORS;
  const { activate, library, active } = useWeb3React();

  const handleConnect = async (currentConnector) => {
    // await activate(walletConnectors[currentConnector]);
    activate(walletConnectors[currentConnector]);

    window.localStorage.setItem(CURRENT_WALLET_STORAGE_NAME, currentConnector);
    // handleSwitch();
    handleClose();
    setConnected(true);
  }

  const handleSwitch = async () => {
    try {
      if (window.ethereum.networkVersion !== chainId) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(chainId).toString(16)}` }]
        }).then(() => {
          setConnected(true);
        });
        console.log("You have successfully switched to Correct Network");
      }
    } catch (ex) {
      setConnected(false);
      NotificationManager.error("Failed to switch to " + NETWORK_NAME + " network.", "ERROR", 3000);
    }
  }

  useEffect(() => {
    // const currentConnect = window.localStorage.getItem(CURRENT_WALLET_STORAGE_NAME);
    // if (currentConnect) {
    //   if (!active) {
    //     activate(walletConnectors[currentConnect]).then(() => {
    //       if (parseInt(window.ethereum.chainId) !== chainId) {
    //         let msg = "You are in " + chainIds[parseInt(window.ethereum.chainId)] +
    //           " network. Plz switch to " + NETWORK_NAME;
    //         NotificationManager.error(msg, "ERROR", 3000);
    //         setConnected(false);
    //         console.log(msg);
    //       }
    //       else setConnected(true);
    //     })
    //   }
    // }
  }, [library, active])

  useEffect(() => {
    document.title = DOCUMENT_TITLE;
  })

  return (
    <>
      <StyledComponent>
        <Topbar
          current={current}
          active={active}
          setConnected={setConnected}
          setCurrent={setCurrent}
          handleConnect={handleConnect}
        // handleSwitch={handleSwitch}
        />
        <Content />
        <NotificationContainer />
      </StyledComponent>
    </>
  );
}

const StyledComponent = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: black;
  `
export default App;

