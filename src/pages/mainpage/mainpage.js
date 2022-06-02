import React from "react";
import { useState, useEffect, useMemo } from 'react'
import { Box, Input, Modal } from '@material-ui/core'
import styled from 'styled-components';

import Btn_normal1 from '../../components/buttons/normal';
import Btn_Stake from "../../components/buttons/stake";
import bnb from '../../images/bnb.png';
import leopard1 from '../../images/leopard1.png';
import { lightTheme, darkTheme } from "../../theme/theme";
import Web3 from 'web3'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core';
import { FASTBAR, FASTTOKEN } from '../../utils/abi';

const Mainpage = ({ ctheme, connect_wallet, apr, set_apr}) => {
    const xfastbar = '0xC6C76947953134160CA40de6015EAdfC864BDd1a';
    const fastbar = '0x1160fe27e5c39284f6aebdec4ad2c1dc6f118d2b';
    // const { account, library, chainId } = useWeb3React()
    // const xfastContract = useMemo(() => library ? new ethers.Contract(xfastbar, FASTTOKEN, library.getSigner()) : null, [library])
    // const fastbarContract = useMemo(() => library ? new ethers.Contract(fastbar, FASTBAR, library.getSigner()) : null, [library])
    let web3;
    const [stake, set_stake] = useState(false)
    const [amount, set_amount] = useState('');
    const style1 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        height: 250,
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        backgroundColor: '#2BA55D',
        border: 'none',
        display: "flex",
        flexDirection: 'column',
    };

    const [rate, set_rate] = useState(0);
    const [open, setOpen] = useState(false);
    const [process, set_process] = useState("Processing...");
    const [process1, set_process1] = useState("Processing...");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const ethEnabled = () => {
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            try {
                window.ethereum.enable();
                return true
            } catch (e) {
                return false
            }

        }

        return false
    }

    const staking_unstaking = async () => {
        set_process("Processing...");
        set_process1("Processing...");
        if (connect_wallet === false) {
            alert("Please connect wallet.");
            return;
        }
        else {
            handleOpen();
            if (!ethEnabled()) {
                alert("Please install Metamask.");
            }
            // var web31 = require('web3');
            // var web31 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
            window.web3 = new Web3(window.web3.currentProvider);
            await window.ethereum.enable();
            const accounts = await window.web3.eth.getAccounts();
            const stake_fast = new window.web3.eth.Contract(FASTBAR, xfastbar);
            const fast = new window.web3.eth.Contract(FASTTOKEN, fastbar);
            let temp = (amount * Math.pow(10, 18)).toString(16);
            let temp1 = (amount * Math.pow(10, 18));
            let stake1 = '0x' + temp;
            console.log(stake1);
            if (!stake) {
                await fast.methods.approve(xfastbar, stake1).send({ from: accounts[0] }).then(async (res) => {
                    set_process("Success!");
                    // setTimeout(()=>{
                    //     handleClose();
                    // },2000);
                }).catch((error) => {
                    set_process("Fault! Try again.");
                    set_amount('');
                    setTimeout(() => {
                        handleClose();
                    }, 2000);
                });
                await stake_fast.methods.enter(stake1).send({ from: accounts[0] }).then(async (res) => {
                    setTimeout(() => {
                        handleClose();
                    }, 2000);
                    set_amount('');
                    set_process1("Success!");
                }).catch((error) => {
                    set_process1("Fault! Try again.");
                    setTimeout(() => {
                        handleClose();
                    }, 2000);
                });
            }
            else {
                await stake_fast.methods.leave(stake1).send({ from: accounts[0] }).then(async (res) => {
                    set_process1("Success!");
                    set_amount('');
                    setTimeout(() => {
                        handleClose();
                    }, 2000);
                }).catch((error) => {
                    set_process1("Fault! Try again.");
                    set_amount('');
                    setTimeout(() => {
                        handleClose();
                    }, 2000);
                });
            }
            const temp_xfast = await stake_fast.methods.totalSupply().call();
            const temp_fast = await fast.methods.balanceOf(xfastbar).call();
            const temp_rate = (window.web3.utils.fromWei(temp_xfast, 'ether'))/(window.web3.utils.fromWei(temp_fast, 'ether'));
            set_rate(temp_rate);
            // APR
            var temp_apr , bonded_ratio;
            const inflation = 0.1;   // 10%
            const tax = 0.02;   // 2%
            var total_fast, total_xfast;
            total_fast = await fast.methods.totalSupply().call();
            total_xfast = await stake_fast.methods.totalSupply().call();
            bonded_ratio = (window.web3.utils.fromWei(total_xfast, 'ether')) / (window.web3.utils.fromWei(total_fast, 'ether')) * 100;
            temp_apr = (inflation * (1-tax) * bonded_ratio)*100;
            set_apr(temp_apr);
        }

    }

    const set_max = async () => {
        if (connect_wallet === false) {
            alert("Please connect wallet.");
            return;
        }
        else {
            var max_xfast, max_fast;
            window.web3 = new Web3(window.web3.currentProvider);
            await window.ethereum.enable();
            const accounts = await window.web3.eth.getAccounts();
            var stake_fast = new window.web3.eth.Contract(FASTBAR, xfastbar)
            var fast = new window.web3.eth.Contract(FASTTOKEN, fastbar);
            if (!stake) {
                max_fast = await fast.methods.balanceOf(accounts[0]).call();
                let max_temp = window.web3.utils.fromWei(max_fast, 'ether');
                set_amount(parseFloat(max_temp));
            }
            else {
                max_xfast = await stake_fast.methods.balanceOf(accounts[0]).call();
                console.log(max_xfast)
                set_amount(window.web3.utils.fromWei(max_xfast, 'ether'));
            }
        }

    }

    useEffect(async() => {
        window.web3 = new Web3(window.web3.currentProvider);
        const accounts = await window.web3.eth.getAccounts();
        const stake_fast = new window.web3.eth.Contract(FASTBAR, xfastbar);
        const fast = new window.web3.eth.Contract(FASTTOKEN, fastbar);
        const temp_xfast = await stake_fast.methods.totalSupply().call();
        const temp_fast = await fast.methods.balanceOf(xfastbar).call();
        const temp_rate = (window.web3.utils.fromWei(temp_xfast, 'ether'))/(window.web3.utils.fromWei(temp_fast, 'ether'));
        set_rate(temp_rate);


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

        // if(connect_wallet)
        // {
        //     window.web3 = new Web3(window.web3.currentProvider);
        //     const accounts = await window.web3.eth.getAccounts();
        //     const stake_fast = new window.web3.eth.Contract(FASTBAR, xfastbar);
        //     const fast = new window.web3.eth.Contract(FASTTOKEN, token_fast);
        //     const temp_xfast = await stake_fast.methods.totalSupply().call();
        //     const temp_fast = await fast.methods.balanceOf(xfastbar).call();
        //     const temp_rate = (window.web3.utils.fromWei(temp_xfast, 'ether'))/(window.web3.utils.fromWei(temp_fast, 'ether'));
        //     set_rate(temp_rate);
        // }
        // else{
        //     set_rate(0);
        // }
    }, [connect_wallet, set_rate])
    return (
        <StyledContainer ctheme={ctheme ? 1 : 0} ltheme={lightTheme} dtheme={darkTheme}>
            <Staking display="flex" flexDirection="column" alignItems="center" borderRadius="30px" ctheme={ctheme ? 1 : 0}>
                {/* <Box display="flex" marginTop="5%" alignItems="center" width="90%">
                    <Box display="flex" flex="2" flexDirection="column">
                        <Box display="flex" color="rgb(25, 19, 38)" fontSize="1.5rem" fontWeight="bold">
                            Maximize yield by staking SUSHI for xSUSHI
                        </Box>
                        <Box display="flex" marginTop="5%">
                            For every swap on the exchange on every chain, 0.05% of the swap<br />
                            fees are distributed as SUSHI\nproportional to your share of the <br />
                            SushiBar. When your SUSHI is staked into the SushiBar, you<br />
                            recieve\nxSUSHI in return for voting rights and a fully composable <br />
                            token that can interact with other protocols.\nYour xSUSHI is <br />
                            continuously compounding, when you unstake you will receive all the <br />
                            originally deposited\nSUSHI and any additional from fees.
                        </Box>
                    </Box>
                    <Box display="flex" flex="1" height="224px" justifyContent="center" alignItems="center">
                        <img src={sushi_img1} width="70%" height="100%"></img>
                    </Box>
                </Box> */}
                <Box display="flex" marginTop="5%" alignItems="center" width="90%" marginBottom="5%">
                    <Box display="flex" flex="2" flexDirection="column" width="100%">
                        <Box display="flex" flexDirection="column" width="100%" bgcolor="rgb(110, 160, 190)" borderRadius="8px" width="100%" alignItems="center">
                            <Box display="flex" flex="1" width="90%" marginTop="3%">
                                <Box display="flex" flex="1" justifyContent="flex-start" alignItems="center" color="black" fontWeight="bold" fontSize="1.5rem">Staking APR</Box>
                                <Box display="flex" flex="1" justifyContent="flex-end" alignItems="center" color="black" fontWeight="bold" fontSize="1.9rem">{apr.toFixed(3)}%</Box>
                            </Box>
                            <Box display="flex" flex="1" width="90%" marginTop="3%" marginBottom="3%">
                                <Box display="flex" flex="1" justifyContent="flex-start" alignItems="center">
                                    <Btn_normal1 cwidth={"60%"} cheight={"35px"} cbgcolor={"rgb(0, 110, 150)"} ccolor={"white"} cborder={"none"} cradius={"8px"} cfsize={"16px"} cfbold={"bold"} str={"View States"}></Btn_normal1>
                                </Box>
                                <Box display="flex" flex="1" justifyContent="flex-end" alignItems="center" color="black" fontWeight="bold" fontSize="1rem">Yesterday's APR</Box>
                            </Box>
                        </Box>
                        <Box display="flex" marginTop="3%" flexDirection="column" width="100%" alignItems="center" borderRadius="8px" bgcolor="rgb(110, 200, 150)" height="300px">
                            <Box display="flex" flex="1" width="90%" marginTop="3%" bgcolor="rgb(160, 250, 185)" borderRadius="8px">
                                <Box display="flex" flex="1" onClick={() => {
                                    set_stake(false); set_amount('')
                                }}>
                                    <Btn_Stake str={'Stake FAST'} cbgcolor={!stake ? 'rgb(43, 165, 100)' : ''}></Btn_Stake>
                                </Box>
                                <Box display="flex" flex="1" onClick={() => { set_stake(true); set_amount('') }}>
                                    <Btn_Stake str={'Unstake'} cbgcolor={stake ? 'rgb(43, 165, 100)' : ''}></Btn_Stake>
                                </Box>

                            </Box>
                            <Rate1 display="flex" flex="1" width="90%" marginTop="3%" >
                                <Box display="flex" flex="1" justifyContent="flex-start" alignItems="center" color="black" fontWeight="bold" fontSize="1.5rem">{!stake ? 'Stake FAST' : 'Unstake'}</Box>
                                <Box display="flex" flex="1" justifyContent="flex-end" alignItems="center">
                                    <Box display="flex" width="100%" justifyContent="center" alignItems="center" borderRadius="30px" bgcolor="rgb(250, 249, 250)" border="1px solid #cd8a8a" fontWeight="bold" fontSize="14px">
                                        1 xFAST = {rate} FAST
                                    </Box>
                                </Box>
                            </Rate1>
                            <Box display="flex" flex="1" width="90%" marginTop="3%" position="relative">
                                <Box display="flex" flex="1" color="black" borderRadius="8px" bgcolor="rgb(160, 250, 185)" width="100%" component="input" border="none" fontSize="20px" fontWeight="bold"
                                    sx={{
                                        'outline': 'none'
                                    }} paddingLeft="3%" paddingRight="3%" onChange={(e) => {
                                        set_amount(e.target.value);
                                    }} value={amount} placeholder={!stake ? '0 FAST' : '0 xFAST'}>
                                </Box>
                                <Box display="flex" position="absolute" width="50%" right="3%" alignItems="center" justifyContent="center" height="100%">
                                    <Box display="flex" flex="1" alignItems="center" justifyContent="flex-end" fontWeight="bold">Balance:</Box>
                                    <Box display="flex" flex="1" component="button" height="50%" borderRadius="20px" bgcolor="rgb(43, 165, 100)" color="white" alignItems="center" fontWeight="bold" justifyContent="center" sx={{
                                        'cursor': 'pointer'
                                    }} onClick={() => {
                                        set_max()
                                    }}>MAX</Box>
                                </Box>
                            </Box>

                            <Box display="flex" flex="1" width="90%" marginTop="3%" marginBottom="3%" alignItems="center" justifyContent="center" onClick={() => staking_unstaking()}>
                                <Btn_normal1 cwidth={"100%"} cheight={"60px"} cbgcolor={"rgb(43, 165, 100)"} ccolor={"white"} cborder={"none"} cradius={"8px"} cfsize={"20px"} cfbold={"bold"} str={"Enter Amount"} ></Btn_normal1>
                            </Box>
                        </Box>
                    </Box>
                    {/* <Box display="flex" flex="1" flexDirection="column" bgcolor="rgb(110, 200, 150)" borderRadius="8px" width="100%" height="100%" alignItems="center" marginLeft="2%">
                        <Box display="flex" flex="4" flexDirection="column" marginTop="5%" width="80%">
                            <Box displya="flex" flex="1" flexDirection="column" justifyContent="flex-start">
                                <Box display="flex" flex="1" color="black" fontSize="1.9rem" fontWeight="bold">Balance</Box>
                                <Box display="flex" flex="1" marginTop="5%" alignItems="center">
                                    <Box display="flex" flex="1" >
                                        <img src={bnb} width="100%" height="100%" style={{ borderRadius: '8px' }}></img>
                                    </Box>
                                    <Box display="flex" flex="2" flexDirection="column" marginLeft="5%">
                                        <Box display="flex" flex="1" color="black" fontWeight="bold" fontSize="1.5rem">-</Box>
                                        <Box display="flex" flex="1" color="black" fontWeight="bold" fontSize="1.5rem">FAST</Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" flex="4" flexDirection="column" marginTop="5%" width="80%">
                            <Box displya="flex" flex="1" flexDirection="column" justifyContent="flex-start">
                                <Box display="flex" flex="1" color="black" fontSize="1.9rem" fontWeight="bold">Unstaked</Box>
                                <Box display="flex" flex="1" marginTop="5%" alignItems="center">
                                    <Box display="flex" flex="1" >
                                        <img src={leopard1} width="100%" height="100%" style={{ borderRadius: '8px' }}></img>
                                    </Box>
                                    <Box display="flex" flex="2" flexDirection="column" marginLeft="5%">
                                        <Box display="flex" flex="1" color="black" fontWeight="bold" fontSize="1.5rem">-</Box>
                                        <Box display="flex" flex="1" color="black" fontWeight="bold" fontSize="1.5rem">xFAST</Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" flex="1" alignItems="center" width="80%" alignItems="center" justifyContent="center" marginBottom="5%">
                            <Btn_normal1 cwidth={"100%"} cheight={"60px"} cbgcolor={"rgb(43, 165, 100)"} ccolor={"white"} cborder={"none"} cradius={"8px"} cfsize={"20px"} cfbold={"bold"} str={"Your FastBar States"}></Btn_normal1>
                        </Box>
                    </Box> */}
                    <Modal
                        open={open}
                        // onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box style={style1}>
                            <MHeader>State</MHeader>
                            {!stake ? <><MContent alignItems="flex-end">Approve:{'\u00a0'}{process}</MContent>
                                <MContent alignItems="flex-start" marginTop="3%">Staking:{'\u00a0'}{process1}</MContent></> :
                                <MContent alignItems="flex-start" marginTop="3%">Unstaking:{'\u00a0'}{process1}</MContent>}
                        </Box>
                    </Modal>
                </Box>
            </Staking>
        </StyledContainer>
    );
};

const Rate1 = styled(Box)`
    flex-direction: row;
    @media (max-width: 768px) {
        flex-direction: column !important;
    }
`

const MHeader = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  font-size: 38px;
  color: white;
  margin-top: 3%;
  align-items: center;

`

const MContent = styled(Box)`
    display: flex;
  flex: 2;
  width: 100%;
  justify-content: center;
  font-size: 25px;
  color: white;
`



const Staking = styled(Box)`
    background-color: ${({ ctheme }) => ctheme ? "#efeeee" : " #2c2b30"};
    box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
    width: 50%;
    @media (max-width: 1000px) {
        width: 65%;
    }
    @media (max-width: 800px) {
        width: 80%;
    }
    @media (max-width: 600px) {
        width: 95%;
    }
`

const StyledContainer = styled(Box)`
    width: 100%;
    height: 100vh;
    background-color: ${({ ctheme, ltheme, dtheme }) => ctheme ? ltheme.bgcolor_bar : dtheme.bgcolor_bar};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default Mainpage;