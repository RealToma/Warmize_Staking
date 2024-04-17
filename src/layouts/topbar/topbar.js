import React, { useEffect, useState } from "react";
import { Box, Modal } from '@material-ui/core';
import styled from "styled-components";
import IMG_Leftback from "../../assets/images/Frame 1.png";
import IMG_Rightback from "../../assets/images/Frame 2.png";
import IMG_Logo from "../../assets/images/logo 7.png";
import CustomBtn from '../../components/CustomBtn';
import { useWeb3React } from "@web3-react/core";
import { AiOutlineHome } from "react-icons/ai"
import { RiMenuUnfoldFill } from "react-icons/ri"
import { HiOutlineDocumentText, HiOutlineCurrencyDollar } from "react-icons/hi"
import { FaWallet, FaMoon } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BiMessageDetail } from 'react-icons/bi';
import { RiBug2Fill, RiMacbookLine, RiGovernmentLine } from 'react-icons/ri';
import { FaGithub, FaTwitter, FaDiscord, FaMedium } from 'react-icons/fa';
import { CustomBackdrop } from "../content/content";
import { WARMIZ_BUY_URL, WARMIZ_DOC_URL, WARMIZ_HOME_URL } from "../../utils/urls";
import metamask from "../../assets/images/wallet/MetaMask.png";
import walletconnect from "../../assets/images/wallet/WalletConnect.png";
import binance from "../../assets/images/wallet/BinanceWallet.png";
import trust from "../../assets/images/wallet/TrustWallet.png";


const Topbar = ({ current, active, setConnected, setCurrent, handleConnect }) => {
    const { account, deactivate } = useWeb3React();
    const [addr, set_addr] = useState("CONNECT");
    const set_account_addr = (addr) => {
        console.log("addr:", addr)
        if(addr=== undefined || addr==='')
        {
            return;
        }
        return addr.slice(0, 6) + "..." + addr.slice(-4);
    }
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open1, setOpen1] = useState(false);
    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);

    useEffect(() => {
        if (active) {
            set_addr(set_account_addr(account))
        }
        else {
            set_addr("CONNECT");
        }
    }, [active, account])

    const collectWallet = () => {
        if (window.ethereum) {
            console.log(window.ethereum.networkVersion);
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    console.log(result[0]);
                })

        } else {
            console.error("Install MetaMask");
            console.log(window);
        }
    }

    return (
        <StyledComponent>
            <BackgroundBox>
                <BackImgPart>
                    <img src={IMG_Leftback} width="100%" height="100%" alt='' />
                </BackImgPart>
                <BackImgPart>
                    <img src={IMG_Rightback} width="100%" height="100%" alt='' />
                </BackImgPart>
            </BackgroundBox>

            <CenterPart>
                <EmptyBox></EmptyBox>
                <LogoPart>
                    <img src={IMG_Logo} width="199px" height="56px" alt='' />
                </LogoPart>
                <LinkPart>
                    <LinkLetter onClick={() => { window.open(WARMIZ_HOME_URL) }}>Home</LinkLetter>
                    <LinkLetter onClick={() => { window.open(WARMIZ_DOC_URL) }}>Docs</LinkLetter>
                    {/* <LinkLetter>Staking</LinkLetter>
                    <LinkLetter>Launchpads</LinkLetter>
                    <LinkLetter>Marketplace</LinkLetter> */}
                </LinkPart>
                <ButtonPart ml={"20px"} mr={"20px"}>
                    <ButtonBox onClick={() => { window.open(WARMIZ_BUY_URL) }}>
                        <CustomBtn width={"100%"} height="100%" str="BUY $WARMIZ" fsize={"16px"} fcolor={"white"} bgcolor="black" border="1.5px solid rgba(255, 255, 255, 0.7)" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                    </ButtonBox>
                    <ButtonBox01
                        onClick={async () => {
                            if (!active) {
                                handleOpen1();

                            }
                            else {
                                setConnected(false);
                                window.localStorage.removeItem("CurrentWalletConnect");
                                await deactivate();
                            }
                        }
                        }
                    >
                        <CustomBtn width={"100%"}
                            height="100%" str={addr} f
                            size={"16px"}
                            fcolor={"black"} bgcolor="white"
                            border="1.5px solid rgba(255, 255, 255, 0.7)"
                            fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                    </ButtonBox01>
                    <MiniButton onClick={() => {
                        handleOpen();
                    }}>
                        <RiMenuUnfoldFill size={"35px"} />
                    </MiniButton>
                </ButtonPart >
                <EmptyBox>
                </EmptyBox>
            </CenterPart>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" BackdropComponent={CustomBackdrop}>
                <ModalComponent>
                    {/* <MarkImg>
                        <img src={Img_OlympusMark01} alt="" width={"60px"}></img>
                    </MarkImg>
                    <MarkLetter>
                        Olympus
                    </MarkLetter> */}
                    {/* <TxtWalletAddress>{active === true ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}</TxtWalletAddress> */}
                    <LinkList>
                        <EachLink onClick={() => {
                            handleClose();
                        }}>
                            <AiOutlineHome fontSize={"1.5rem"} />
                            <EachLinkTxt onClick={() => { window.open(WARMIZ_HOME_URL) }}>Home</EachLinkTxt>
                        </EachLink>
                        <EachLink onClick={() => {
                            handleClose();
                        }}>
                            <HiOutlineDocumentText fontSize={"1.5rem"} />
                            <EachLinkTxt onClick={() => { window.open(WARMIZ_DOC_URL) }}>Docs</EachLinkTxt>
                        </EachLink>
                        {/* <EachLink onClick={() => {
                            handleClose();
                        }}>
                            <RiGovernmentLine fontSize={"1.5rem"} />
                            <EachLinkTxt >Staking</EachLinkTxt>
                        </EachLink>
                        <EachLink onClick={() => {
                            handleClose();
                        }}>
                            <RiMacbookLine fontSize={"1.5rem"} />
                            <EachLinkTxt >Launchpads</EachLinkTxt>
                        </EachLink>
                        <EachLink onClick={() => {
                            handleClose();
                        }}>
                            <MdOutlineShoppingCart fontSize={"1.5rem"} />
                            <EachLinkTxt >Marketplace</EachLinkTxt>
                        </EachLink> */}
                        <EachLink onClick={() => {
                            handleClose();
                        }}>
                            <HiOutlineCurrencyDollar fontSize={"1.5rem"} />
                            <EachLinkTxt onClick={() => { window.open(WARMIZ_BUY_URL) }}>Buy $WARMIZ</EachLinkTxt>
                        </EachLink>
                        {/* <EachLink onClick={() => {
                            handleClose();
                        }}>
                            <GiMushroom fontSize={"1.5rem"} />
                            <EachLinkTxt >Grants</EachLinkTxt>
                        </EachLink> */}
                    </LinkList>
                    <ContactList>
                        <Box display={"flex"} width="80%" justifyContent={"space-between"}>
                            <ContactBox><FaGithub /></ContactBox>
                            <ContactBox><FaMedium /></ContactBox>
                            <ContactBox><FaTwitter /></ContactBox>
                            <ContactBox><FaDiscord /></ContactBox>
                        </Box>
                    </ContactList>
                </ModalComponent>
            </Modal>
            <Modal open={open1} onClose={handleClose1} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <ModalBox>
                    <Box
                        sx={{
                            height: "68px",
                            display: "flex",
                            alignItems: "flex-start",
                            lineheight: "initial",
                        }}
                    >
                        <Box fontSize="28px" fontWeight="bold" color="white">
                            Select a Wallet
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" height="100%" width="100%">
                        <Box display="flex" alignItems="center" height="100%" flex="1">
                            <WalletBox
                                onClick={() => {
                                    // handleSwitch();
                                    setConnected(true);
                                    handleConnect("MetaMask");
                                    setCurrent("MetaMask");
                                    collectWallet();
                                    handleClose1();

                                }}
                            >
                                <img src={metamask} width="40px" height="40px" alt=""></img>
                                <Connectbtnletter fontWeight="bold" margin="20px" color="#E2650E" fontSize="1.25rem">
                                    MetaMask
                                </Connectbtnletter>
                            </WalletBox>
                        </Box>
                        <Box display="flex" alignItems="center" height="100%" flex="1">
                            <WalletBox
                                onClick={() => {
                                    setConnected(true);
                                    handleConnect("WalletConnect");
                                    setCurrent("WalletConnect");
                                    collectWallet();
                                    handleClose1();
                                }}
                            >
                                <img src={walletconnect} width="40px" height="40px" alt=""></img>
                                <Connectbtnletter fontWeight="bold" margin="20px" color="#E2650E" fontSize="1.25rem">
                                    WalletConnect
                                </Connectbtnletter>
                            </WalletBox>
                        </Box>
                        <Box display="flex" alignItems="center" height="100%" flex="1">
                            <WalletBox
                                onClick={() => {
                                    setConnected(true);
                                    handleConnect("BinanceWallet");
                                    setCurrent("BinanceWallet");
                                    collectWallet();
                                    handleClose1();
                                }}
                            >
                                <img src={binance} width="40px" height="40px" alt=""></img>
                                <Connectbtnletter fontWeight="bold" margin="20px" color="#E2650E" fontSize="1.25rem">
                                    BinanceWallet
                                </Connectbtnletter>
                            </WalletBox>
                        </Box>
                        <Box display="flex" alignItems="center" height="100%" flex="1">
                            <WalletBox
                                onClick={() => {
                                    setConnected(true);
                                    handleConnect("TrustWallet");
                                    setCurrent("TrustWallet");
                                    collectWallet();
                                    handleClose1();
                                }}
                            >
                                <img src={trust} width="40px" height="40px" alt=""></img>
                                <Connectbtnletter fontWeight="bold" margin="20px" color="#E2650E" fontSize="1.25rem">
                                    TrustWallet
                                </Connectbtnletter>
                            </WalletBox>
                        </Box>
                    </Box>
                </ModalBox>
            </Modal>
        </StyledComponent >
    );
}

const StyledComponent = styled(Box)`
    display: flex;
    width: 100%;
    height: 110px;
    align-items: center;

`
const BackImgPart = styled(Box)`
    display: flex;
    width: 252px;
    height: 100%;
`
const CenterPart = styled(Box)`
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
`
const LogoPart = styled(Box)`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    @media (max-width: 500px) {
        >img{
            transition: 0.5s;
            width: 160px;
        }
    }  
`

const LinkPart = styled(Box)`
    display: flex;
    flex: 2;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    @media (max-width: 900px) {
        transition: 0.5s;
        display: none;
    }
`
const LinkLetter = styled(Box)`
    display: flex;
    /* flex: 1; */
    color: white;
    align-items: center;
    justify-content: center;
    font-family: 'Russo One';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    padding: 10%;
    &:hover{
        cursor: pointer;
        color: #F5841F;
        transition: .5s;
    }
    @media (max-width: 1000px) {
        transition: 0.5s;
        font-size: 12px;
    }
    
`
const ButtonBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 170px;
    height: 50px;
    @media (max-width: 1000px) {
        transition: 0.5s;
        width: 150px;
        height: 40px;
    }
    @media (max-width: 750px) {
        transition: 0.5s;
        display: none;
    }
`

const ButtonBox01 = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 170px;
    height: 50px;
    @media (max-width: 1000px) {
        transition: 0.5s;
        width: 150px;
        height: 40px;
    }
    @media (max-width: 500px) {
        transition: 0.5s;
        width: 130px;
        height: 40px;
    }
    @media (max-width: 450px) {
        transition: 0.5s;
        width: 100px;
        height: 35px;
        >div{
            font-size: 12px;
        }
    }
`

const ButtonPart = styled(Box)`
    display: flex;
    flex: 1.7;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 900px) {
        transition: 0.5s;
        flex: 1;
    }
    /* @media (max-width: 700px) {
        transition: 0.5s;
        justify-content: center;
        flex: 1;
    } */
`

const BackgroundBox = styled(Box)`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    position: relative;
`

const EmptyBox = styled(Box)`
    display: flex;
    flex: 1;
    @media (max-width: 1400px) {
        transition: 0.5s;
        display: none;
    }
`
const MiniButton = styled(Box)`
    display: none;
    color: white;
    cursor: pointer;
    &:hover{
        transition: 0.5s;
        color: rgb(245, 132, 31);
    }
    @media (max-width: 900px) {
        transition: 0.5s;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    @media (max-width: 750px) {
        transition: 0.5s;
        margin-right: 10%;
    }
    @media (max-width: 450px) {
        transition: 0.5s;
        margin-right: 0%;
    }
`
const ModalComponent = styled(Box)`
    display: flex;
    transition: 1s;
    position: fixed;
    width: 260px;
    outline: none;
    height: 100%;
    flex-direction: column;
    align-items: center ;
    /* background-color: rgb(40,45,58); */
    background: black;
    @media (min-width: 1000px) {
        display: none;
    }
`
const MarkImg = styled(Box)`
    display: flex;
    justify-content: center;
    margin-top: 30px;
`

const MarkLetter = styled(Box)`
    display: flex;
    justify-content: content;
    margin-top: 10px;
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
`
const TxtWalletAddress = styled(Box)`
    display: flex;
    justify-content: center;
    color: white;
    font-size: 1rem;
    margin-top: 5px;
`
const LinkList = styled(Box)`
    display: flex;
    width: 100%;
    flex-direction: column;
    color: white;
    margin-top: 30px;
`
const EachLink = styled(Box)`
    display: flex;
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: 30px;
    align-items: center;
    &:hover{
        cursor: pointer;
        color: rgb(245, 132, 31);
    }
`
const EachLinkTxt = styled(Box)`
    display: flex;
    margin-left: 15px;
    font-size: 1rem;
`

const ContactList = styled(Box)`
    display: flex;
    position: fixed;
    bottom: 15px;
    min-width: 260px;
    left: 0px;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    /* color: rgb(104,106,116); */
    color: white;
`

const ContactBox = styled(Box)`
    display: flex;
    &:hover{
        cursor: pointer;
        color: rgb(245, 132, 31);
    }
`
const Connectbtnletter = styled(Box)`
  @media (max-width: 400px) {
    font-size: 1rem !important;
  }
`
const ModalBox = styled(Box)`
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 468px;
    box-shadow: 24px;
    padding: 20px;
    border-radius: 10px;
    background-color: #E2650E;
    flex-direction: column;
    outline: none;
    animation: back_animation1 0.5s 1;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
    @keyframes back_animation1 {
        0% {
            opacity: 0%;
        }
        100% {
            opacity: 100%;
        }
    }
    @media (max-width: 700px) {
        width: 350px;
    }
    @media (max-width: 500px) {
        width: 300px;
    }
    @media (max-width: 400px) {
        width: 220px;
    }
`
const WalletBox = styled(Box)`
    display: flex;
    width: 100%;
    cursor: pointer;
    padding: 16px;
    transition: ease-out 0.4s;
    align-items: center;
    border-radius: 12px;
    flex-direction: 12px;
    background-color: #FCFCFC;
    height: 50%;
    &:hover{
        transition: .5s;
        box-shadow: 0 5px 15px rgb(0 0 0 / 100%);
    }
`

export default Topbar;
