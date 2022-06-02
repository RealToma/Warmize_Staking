/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useState, useEffect } from 'react'
import { Box, Modal } from '@material-ui/core'
import styled from 'styled-components';
import { MdMenuOpen } from "react-icons/md";
import {
    injected,
    walletConnect,
    trustWallet,
    binance_wallet,
} from "../../utils/connectors";
import _ from "lodash";
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import metamask from '../../images/MetaMask.png'
import walletconnect from '../../images/WalletConnect.png'
import binance from '../../images/BinanceWallet.png'
import trust from '../../images/TrustWallet.png'
import img_logo from '../../images/logo_mark1.png';
import { lightTheme, darkTheme } from "../../theme/theme";
import { FASTBAR, FASTTOKEN } from "../../utils/abi";
// import { useHistory } from "react-router";

const Header = ({ flag_sidebar, set_sidebar, ctheme, set_connect, set_apr}) => {
    
    // const history = useHistory()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [account_address, set_account] = useState('Connect');
    const style1 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '50%',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        backgroundColor: '#2BA55D',
        display: "flex",
        flexDirection: 'column',
    };
    const DESKTOP_CONNECTORS = {
        MetaMask: injected,
        WalletConnect: walletConnect,
        BinanceWallet: binance_wallet,
        TrustWallet: trustWallet,
    };

    const MOBILE_CONNECTORS = {
        MetaMask: injected,
        TrustWallet: trustWallet,
        BinanceWallet: binance_wallet,
    };
    const walletConnectors = DESKTOP_CONNECTORS;
    const { connector, account, active, activate } = useWeb3React();
    const handleConnect = async (currentConnector) => {
        setOpen(false);
        activate(currentConnector);
        window.web3 = new Web3(window.web3.currentProvider);
        await window.ethereum.enable();
        let accounts = await window.web3.eth.getAccounts();
        let temp = accounts[0];
        set_account(temp.slice(0, 4) + "..." + temp.slice(temp.length - 5, temp.length - 1));

        const token_address = '0xC6C76947953134160CA40de6015EAdfC864BDd1a';
        const token_fast = '0x1160fe27e5c39284f6aebdec4ad2c1dc6f118d2b';
        const stake_fast = new window.web3.eth.Contract(FASTBAR, token_address);
        const fast = new window.web3.eth.Contract(FASTTOKEN, token_fast);

        //apr
        var temp_apr , bonded_ratio;
        const inflation = 0.1;   // 10%
        const tax = 0.02;   // 2%
        var total_fast, total_xfast;
        total_fast = await fast.methods.totalSupply().call();
        total_xfast = await stake_fast.methods.totalSupply().call();
        bonded_ratio = (window.web3.utils.fromWei(total_xfast, 'ether')) / (window.web3.utils.fromWei(total_fast, 'ether')) * 100;
        temp_apr = (inflation * (1-tax) * bonded_ratio)*100;
        set_apr(temp_apr);
        // set_account_address();
    }
    // const set_account_address = () =>{
    //     let temp = account;
    //     set_account(temp.slice(0,4)+"..."+temp.slice(temp.length-5, temp.length-1));
    // }


    useEffect(() => {
        if (active === true) {
            set_connect(true);
        }
        else {
            set_connect(false);
        }
    })
    return (
        <StyledContainer ctheme={ctheme ? 1 : 0} ltheme={lightTheme} dtheme={darkTheme}>
            {/* {theme? <div>123</div>:<div>KKK</div>} */}
            <Box display="flex" flex="1.3" alignItems="center" marginLeft="1%" marginRight="1%" fontWeight="900" fontSize="23px" color={ctheme ? lightTheme.font_color1 : darkTheme.font_color1}>
                <MdMenuOpen onClick={() => set_sidebar(!flag_sidebar)} fontSize="24px" color="#2BA55D" />
                <Logo_img>
                    <Box display="flex" alignItems="center"><img src={img_logo} width="25px" height="25px" style={{ marginLeft: "30px" }}></img></Box>
                    <Box display="flex" alignItems="center">{'\u00a0'}FastSwap</Box>

                </Logo_img>
            </Box>
            <Box display="flex" flex="3"></Box>
            <Box display="flex" flex="1" alignItems="center" justifyContent="flex-end" marginRight="16px">
                {
                    account_address === 'Connect' ? <Btn_connect onClick={handleOpen}>Connect</Btn_connect> :
                        <Btn_connect1 onClick={handleOpen}>{account_address}</Btn_connect1>
                }

            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ConnectW sx={style1}>
                    <Box sx={{
                        height: '68px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        lineHeight: 'initial',
                    }}>
                        <Box fontSize='28px' fontWeight='bold' color='white'>Select a Wallet</Box>
                    </Box>
                    <Box display='flex' flexDirection='column' height="100%" width='100%'>
                        <Box display='flex' alignItems="center" height="100%" flex='1' >
                            <Box sx={{
                                width: '100%',
                                cursor: 'pointer',
                                display: 'flex',
                                padding: '16px',
                                transition: 'ease-out 0.4s',
                                alignItems: 'center',
                                borderRadius: '12px',
                                flexDirection: 'row',
                                backgroundColor: '#FCFCFC',
                                boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                                height: '50%',
                            }} onClick={() => { handleConnect(walletConnectors['MetaMask']) }}>
                                <img src={metamask} width="40px" height="40px"></img><Connect_btn_letter fontWeight='bold' margin='20px' color='#337ab7' fontSize='1.25rem'>MetaMask</Connect_btn_letter>
                            </Box>
                        </Box>
                        <Box display='flex' alignItems="center" height="100%" flex='1'>
                            <Box sx={{
                                width: '100%',
                                cursor: 'pointer',
                                display: 'flex',
                                padding: '16px',
                                transition: 'ease-out 0.4s',
                                alignItems: 'center',
                                borderRadius: '12px',
                                flexDirection: 'row',
                                backgroundColor: '#FCFCFC',
                                boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                                height: '50%',
                            }} onClick={() => { handleConnect(walletConnectors['WalletConnect']) }}>
                                <img src={walletconnect} width="40px" height="40px"></img><Connect_btn_letter fontWeight='bold' margin='20px' color='#337ab7' fontSize='1.25rem'>WalletConnect</Connect_btn_letter>
                            </Box>
                        </Box>
                        <Box display='flex' alignItems="center" height="100%" flex='1'>
                            <Box sx={{
                                width: '100%',
                                cursor: 'pointer',
                                display: 'flex',
                                padding: '16px',
                                transition: 'ease-out 0.4s',
                                alignItems: 'center',
                                borderRadius: '12px',
                                flexDirection: 'row',
                                backgroundColor: '#FCFCFC',
                                boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                                height: '50%',
                            }} onClick={() => { handleConnect(walletConnectors['BinanceWallet']) }}>
                                <img src={binance} width="40px" height="40px"></img><Connect_btn_letter fontWeight='bold' margin='20px' color='#337ab7' fontSize='1.25rem'>BinanceWallet</Connect_btn_letter>
                            </Box>
                        </Box>
                        <Box display='flex' alignItems="center" height="100%" flex='1'>
                            <Box sx={{
                                width: '100%',
                                cursor: 'pointer',
                                display: 'flex',
                                padding: '16px',
                                transition: 'ease-out 0.4s',
                                alignItems: 'center',
                                borderRadius: '12px',
                                flexDirection: 'row',
                                backgroundColor: '#FCFCFC',
                                boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                                height: '50%',
                            }} onClick={() => { handleConnect(walletConnectors['TrustWallet']) }}>
                                <img src={trust} width="40px" height="40px"></img><Connect_btn_letter fontWeight='bold' margin='20px' color='#337ab7' fontSize='1.25rem'>TrustWallet</Connect_btn_letter>
                            </Box>
                        </Box>
                    </Box>
                </ConnectW>
            </Modal>
        </StyledContainer>
    );
};


const ConnectW = styled(Box)`
    width: 30%;
    @media (max-width: 1000px) {
        width: 40%;
    }
    @media (max-width: 800px) {
        width: 50%;
    }
    @media (max-width: 600px) {
        width: 60%;
    }
    @media (max-height: 850px) {
        height: 60% !important;
    }
    @media (max-height: 700px) {
        height: 70% !important;
    }
    @media (max-height: 600px) {
        height: 75% !important;
    }
`

const Connect_btn_letter = styled(Box)`
@media (max-width: 400px) {
    font-size:0.75rem !important;
    
}
`

const Logo_img = styled(Box)`
    display: flex;
    @media (max-width: 600px) {
        display: none;
        
    }

`
const StyledContainer = styled(Box)`
    position: relative;
    display: flex;
    width: 100%;
    height: 64px;
    background: ${({ ctheme, ltheme, dtheme }) => ctheme ? ltheme.bgcolor_bar : dtheme.bgcolor_bar};
    border-bottom: ${({ ctheme }) => ctheme ? '2px solid #F0F0F0' : '2px solid #2ba55d'};
    //#564a4a
    // box-shadow: 0px 4px 3px -4px rgba(0, 0, 0, 0.08);
`

const Btn_connect = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 32px;
    background: #2BA55D;
    border-radius: 16px;
    color: white;
    font-family: 'Work Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.03em;
    line-height: 1;
    font-size: 16px;
    &:hover{
        cursor: pointer;
        box-shadow:
        inset 0 -3em 3em rgba(0,0,0,0.1),
              0 0  0 0px rgb(255,255,255),
              0.3em 0.3em 1em rgba(0,0,0,0.3);
    }
    @media (max-width: 800px) {
        font-size: 12px;
        
    }
    @media (max-width: 600px) {
        font-size: 8px;
        
    }
`

const Btn_connect1 = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 122px;
    height: 32px;
    background: rgb(239, 244, 245);
    border-radius: 16px;
    color: rgb(43, 165, 93);
    font-family: 'Work Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.03em;
    line-height: 1;
    font-size: 16px;
    &:hover{
        cursor: pointer;
        box-shadow:
        inset 0 -3em 3em rgba(0,0,0,0.1),
              0 0  0 0px rgb(255,255,255),
              0.3em 0.3em 1em rgba(0,0,0,0.3);
    }
    @media (max-width: 800px) {
        font-size: 12px;
        
    }
    @media (max-width: 600px) {
        font-size: 8px;
        
    }
`


export default Header;