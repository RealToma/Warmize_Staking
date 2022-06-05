import React, { useEffect, useState, useMemo } from "react";
import { Box, Modal } from '@material-ui/core';
import { TailSpin } from "react-loader-spinner";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import "../../notifications.css";
import styled from "styled-components";
import IMG_SHAPE01 from "../../assets/images/shapes.png"
import CustomBtn from '../../components/CustomBtn';
import CustomInput from "../../components/CustomInput";
import IMG_Graph01 from "../../assets/images/Graph.png";
import IMG_Graph02 from "../../assets/images/Graph (1).png";
import IMG_Graph03 from "../../assets/images/Graph (2).png";
import IMG_LeftSlide01 from "../../assets/images/Frame.png";
import IMG_LeftSlide02 from "../../assets/images/Frame (1).png";
import IMG_Logo from "../../assets/images/logo 7.png";
import { FaTwitter, FaTelegram, FaMediumM, FaYoutube, FaLinkedin, FaGithub, FaReddit } from "react-icons/fa";
import {
    TWITTER_URL, YOUTUBE_URL, REDDIT_URL, LINKEDIN_URL, GITHUB_URL, TELEGRAM_URL,
    WARMIZ_BUY_URL, WARMIZ_DOC_URL, WARMIZ_JOIN_URL, WARMIZ_HOME_URL
} from "../../utils/urls";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import { WARMIZ_ABI, SWARMIZ_ABI } from "../../utils/abi";
import { CONTRACTS } from "../../utils/constants";
import { useGetPrice } from "../../hook/price";
import { scanUrl } from "../../utils/connectors"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { chainId } from "../../utils/connectors";
import { HTTP_PROVIDER_URL } from "../../utils/constants";


const Content = () => {
    const { account, active, library } = useWeb3React();
    const simpleRpcProvider = new StaticJsonRpcProvider(HTTP_PROVIDER_URL)
    const WARMIZE_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.WARMIZ_TOKEN, WARMIZ_ABI, library.getSigner()) : new ethers.Contract(CONTRACTS.WARMIZ_TOKEN, WARMIZ_ABI, simpleRpcProvider)), [library]);
    const SWARMIZE_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.WARMIZ_STOKEN, SWARMIZ_ABI, library.getSigner()) : new ethers.Contract(CONTRACTS.WARMIZ_STOKEN, SWARMIZ_ABI, simpleRpcProvider)), [library]);

    const [open, set_open] = useState(false);
    const [total_stake, set_total_stake] = useState(0);
    const [total_apy, set_total_apy] = useState(0);
    const [total_stakers, set_total_stakers] = useState(0);
    const [user_total_stake, set_user_total_stake] = useState(0);
    const [total_earned, set_total_earned] = useState(0);
    const [user_withdrawable, set_user_withdrawable] = useState(0);
    const [user_pools, set_user_pools] = useState(null);

    // const [price, price_ether] = useGetPrice();
    const price = 1;
    const [early_unstake_fee, set_early_unstake_fee] = useState(0);
    const max_Duration_Second = 31536000;
    const DAY = 24 * 60 * 60;

    const [balance, set_balance] = useState(0);
    const [duration, set_duration] = useState(0);
    const [apr, set_apr] = useState(0);
    const [current_apr, set_current_apr] = useState(0);

    const [stake_amount, set_stake_amount] = useState(0);
    const [flag_spin_load, set_spin_load] = useState(false);
    const [flag_spin_approve, set_spin_approve] = useState(false);
    const [flag_spin_claim, set_spin_claim] = useState(false);
    const [flag_spin_withdraw, set_spin_withdraw] = useState(false);
    const [flag_spin_withdraw_index, set_spin_withdraw_index] = useState(0);

    const [timeLeft, setTimeLeft] = useState(0);
    const [timerComponent, setTimerComponent] = useState('');

    function getdynamicAPR(_start, _end) {
        let start = parseInt(_start._hex);
        let end = parseInt(_end._hex);
        let apr_value = apr;
        if ((parseInt(_end._hex) - parseInt(_start._hex)) === max_Duration_Second)
            apr_value = apr * 2;
        else {
            apr_value = ((1 + ((end - start) / max_Duration_Second)) * apr).toFixed(2);
        }
        return apr_value;
    }

    const getTotalStakers = async () => {
        const stakers = await SWARMIZE_Contract.totalStakers();
        set_total_stakers(parseInt(stakers._hex));
    }

    function getcurrentAPR(duration) {
        const temp = duration * DAY;
        let apr_value = ((1 + (temp / max_Duration_Second)) * apr).toFixed(2);
        return set_current_apr(apr_value);
    }

    const get_early_unstake_fee = async () => {
        try {
            const value = await SWARMIZE_Contract.emergencyFee();
            set_early_unstake_fee(parseInt(value._hex));
        } catch (ex) {
            console.log(ex);
        }
    }

    const get_balance = async () => {
        try {
            const warmiz_balance = await WARMIZE_Contract.balanceOf(account);
            set_balance(parseInt(warmiz_balance) / Math.pow(10, 18));
        } catch (ex) {
            console.log(ex);
        }
    }

    const get_apr = async () => {
        set_apr(process.env.REACT_APP_APR);
    }

    const get_total_stake = async () => {
        try {
            const total = await SWARMIZE_Contract.totalLockedAmount();
            set_total_stake((parseInt(total) / Math.pow(10, 18)).toFixed(2));
        } catch (ex) {
            console.log(ex);
        }
    }

    const get_user_total_stake = async () => {
        try {
            const user_total = await SWARMIZE_Contract.getTotalDeposit(account);
            set_user_total_stake((parseInt(user_total) / Math.pow(10, 18)).toFixed(2));
        } catch (ex) {
            console.log(ex);
        }
    }

    const get_total_earned = async () => {
        try {
            const earned = await SWARMIZE_Contract.totalClaimReward();
            set_total_earned((parseInt(earned._hex) / Math.pow(10, 18)).toFixed(2));
        } catch (ex) {
            console.log(ex);
        }
    }

    const get_user_withdrawable = async () => {
        try {
            const withdrawable = await SWARMIZE_Contract.withdrawableRewardsOf(account);
            set_user_withdrawable((parseInt(withdrawable) / Math.pow(10, 18)).toFixed(2));
        } catch (ex) {
            console.log(ex);
        }
    }

    const update_duration = (value) => {
        set_duration(value);
        getcurrentAPR(value);
        console.log(value);
    }

    const stake = async () => {
        try {
            set_spin_load(true);
            set_spin_approve(true);
            const amount_wei = stake_amount * Math.pow(10, 18);
            const approve = await WARMIZE_Contract.approve(CONTRACTS.WARMIZ_STOKEN, "0x" + amount_wei.toString(16));
            await approve.wait();

            var t_duration = duration * DAY;
            // if (duration == 7) t_duration = 0;

            const stake = await SWARMIZE_Contract.deposit("0x" + amount_wei.toString(16), "0x" + t_duration.toString(16), account);
            await stake.wait();


            NotificationManager.success("Stake successfully.  See your result: " +
                stake.hash.toString().slice(0, 10) + "..." + stake.hash.toString().slice(-4),
                "Transaction Succeeded.", 6000, () => { window.open(scanUrl + "/tx/" + stake.hash) });

            setTimeout(() => {
                set_duration(7);
                get_total_stake();
                get_user_total_stake();
                get_balance();
                get_pools();
            })

            set_stake_amount(0);
            set_spin_load(false);
            set_spin_approve(false);
        } catch (ex) {
            NotificationManager.error("Failed to stake.", "Error", 3000);
            set_spin_load(false);
            set_spin_approve(false);
            set_stake_amount(0);
            console.log(ex);
        }
    }

    const claim = async () => {
        try {
            set_spin_load(true);
            set_spin_claim(true);

            const claim = await SWARMIZE_Contract.claimRewards(account);

            NotificationManager.success("Claim successfully.  See your result: " +
                claim.hash.toString().slice(0, 10) + "..." + claim.hash.toString().slice(-4),
                "Transaction Succeeded.", 6000, () => { window.open(scanUrl + "/tx/" + claim.hash) });

            set_user_withdrawable(0);
            get_balance();
            get_total_earned();

            set_spin_load(false);
            set_spin_claim(false);
        } catch (ex) {
            NotificationManager.error("Failed to claim reward.", "Error.", 3000);
            set_spin_load(false);
            set_spin_claim(false);
            console.log(ex);
        }
    }

    const withdraw = async () => {
        try {
            // set_open(true);
            set_spin_load(true);
            set_spin_withdraw(true);
            const unstake_mc = await SWARMIZE_Contract.withdraw(flag_spin_withdraw_index, account);
            await unstake_mc.wait();
            console.log("here", unstake_mc.hash);


            NotificationManager.success("Withdraw successfully.  See your result: " +
                unstake_mc.hash.toString().slice(0, 10) + "..." + unstake_mc.hash.toString().slice(-4),
                "Transaction Succeeded.", 6000, () => { window.open(scanUrl + "/tx/" + unstake_mc.hash) });
            get_pools();
            get_user_total_stake();
            get_total_stake();
            set_spin_load(false);
            set_spin_withdraw(false);
        } catch (error) {
            NotificationManager.error("Failed to withdraw", "Error", 3000);
            set_spin_load(false);
            set_spin_withdraw(false);
            console.log(error);
        }
        set_spin_load(false);
    }

    const get_pools = async () => {
        try {
            const pools = await SWARMIZE_Contract.getDepositsOf(account);
            set_user_pools(pools);
            console.log(pools);
        } catch (ex) {
            console.log(ex);
        }
    }

    function getNowTimeStamp() {
        const now = new Date().getTime();
        return now;
    }

    function getNowDate() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        return date;
    }

    useEffect(() => {
        get_total_stake();
        get_apr();
        get_early_unstake_fee();
        set_duration(7);
        getcurrentAPR(7);
        if (active === false) {
            set_user_total_stake(0);
            set_balance(0);
            set_total_earned(0);
            set_user_withdrawable(0);
            set_user_pools(null);
        }
        else {
            // if (window.ethereum) {
            //     if (parseInt(window.ethereum.networkVersion) === chainId) {
            //         get_user_total_stake();
            //         get_balance();
            //         get_pools();
            //         get_total_earned();
            //         get_user_withdrawable();
            //         getTotalStakers();
            //     }
            // }
            get_user_total_stake();
            get_balance();
            get_pools();
            get_total_earned();
            get_user_withdrawable();
            getTotalStakers();

        }
    }, [active, library, account])

    useEffect(() => {
        const timer = setTimeout(() => {
            calculateTimeLeft();
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    const calculateTimeLeft = () => {
        var date = new Date();
        var dateNow = new Date(date.toUTCString('en-US', {
            timeZone: 'GMT'
        }));
        // add a day
        var dateOneDayAfter = new Date();
        dateOneDayAfter.setDate(dateNow.getDate() + 1);
        const ONE_DAY = 1000 * 60 * 60 * 24;

        let difference = (dateOneDayAfter % ONE_DAY) * ONE_DAY - dateNow;
        setTimeLeft(difference);
        if (difference > 0) {
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            let component = hours + " : " + minutes + " : " + seconds;
            // console.log(component);
            setTimerComponent(component);
        }
    }


    return (
        <StyledComponent>
            <TopPart>
                <LeftPart01>
                    {/* <Box display={"flex" }></Box> */}
                    <TopPart01 >
                        <Letter01>HOME . DOCS .</Letter01>
                        <Letter02>{'\u00a0'}STAKING</Letter02>
                        <ImgPart01>
                            <img src={IMG_SHAPE01} alt='' />
                        </ImgPart01>
                    </TopPart01>
                    <TopPart02>staking</TopPart02>
                </LeftPart01>
                <CenterPart01>
                </CenterPart01>
                <RightPart01 >
                    <LeaderBox>
                        <CustomBtn width={"100%"} height="100%" str="LEADERBOARD" fsize={"16px"} fcolor={"white"} bgcolor=" rgba(255, 255, 255, 0.1)" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                    </LeaderBox>
                </RightPart01>
                {/* <Box display={"flex"} position="absolute" width={"100%"} height="100%">
                    <Box display={"flex"} flex="1" >
                    </Box>
                    <Box display={"flex"} flex="8" >
                        <Box display={"flex"} flex="1" flexDirection={"column"} justifyContent="center">
                            <TopPart01 >
                                <Letter01>HOME . DOCS .</Letter01>
                                <Letter02>{'\u00a0'}STAKING</Letter02>
                                <ImgPart01>
                                    <img src={IMG_SHAPE01} alt='' />
                                </ImgPart01>
                            </TopPart01>
                            <TopPart02>staking</TopPart02>
                        </Box>
                        <Box display={"flex"} flex="1" justifyContent={"flex-end"} alignItems="center">
                            <Box display={"flex"} >
                                <CustomBtn width={"170px"} height="50px" str="LEADERBOARD" fsize={"16px"} fcolor={"white"} bgcolor=" rgba(255, 255, 255, 0.1)" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                            </Box>
                        </Box>
                    </Box>
                    <Box display={"flex"} flex="1">
                    </Box>
                </Box> */}
            </TopPart>
            <CenterPart>
                {/* <Box display={"flex"} flex="1"></Box> */}
                <Box display={"flex"} flex="5" flexDirection={"column"} width="100%">
                    <UpPart01>
                        <LeftPart02>
                            <LetterBox01>Staking System</LetterBox01>
                            <LetterBox02>
                                <Box display={"flex"} flexDirection={"column"}>
                                    <Box display={"flex"} >
                                        <Box display={"flex"} color="white" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"24px"}>
                                            {user_total_stake}</Box>
                                        <Box display={"flex"} color="white" fontWeight="400" fontFamily={'Russo One'} fontSize="16px" lineHeight={"24px"} ml="10px">WARMIZ</Box>
                                    </Box>
                                    <Box display={"flex"} marginTop="10px">
                                        <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="14px" lineHeight={"24px"}>Total Stake</Box>
                                    </Box>
                                </Box>
                                <LetterBox03>
                                    <Box display={"flex"}>
                                        <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"24px"}>{user_withdrawable} </Box>
                                        <Box display={"flex"} color="white" fontWeight="400" fontFamily={'Russo One'} fontSize="16px" lineHeight={"24px"} ml="10px">WARMIZ</Box>
                                    </Box>
                                    <Box display={"flex"} marginTop="10px">
                                        <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="14px" lineHeight={"24px"}>Claimable</Box>
                                    </Box>
                                </LetterBox03>
                            </LetterBox02>
                            <Box display={"flex"} border={"1px solid rgba(255, 255, 255, 0.15)"} mt="30px" width={"100%"}></Box>
                            <LetterBox04 >
                                <ButtonBox01 onClick={() => {
                                    update_duration(7);
                                }}>
                                    <CustomBtn
                                        width={"100%"} height="50px"
                                        hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)"
                                        str="7 DAYS" fsize={"16px"} hborder={"1px solid #191919"}
                                        fcolor={"white"} bgcolor={duration == 7 ? "#191919" : "black"}
                                        border="1.5px solid rgba(255, 255, 255, 0.7)"
                                        fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                                </ButtonBox01>
                                <ButtonBox01 onClick={() => {
                                    update_duration(14);
                                }}>
                                    <CustomBtn
                                        width={"100%"} height="50px"
                                        hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)"
                                        str="14 DAYS" fsize={"16px"} hborder={"1px solid #191919"}
                                        fcolor={"white"} bgcolor={duration == 14 ? "#191919" : "black"}
                                        border="1.5px solid rgba(255, 255, 255, 0.7)"
                                        fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                                </ButtonBox01>
                                <ButtonBox01 onClick={() => {
                                    update_duration(30);
                                }}>
                                    <CustomBtn
                                        width={"100%"} height="50px"
                                        hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)"
                                        str="30 DAYS" fsize={"16px"} hborder={"1px solid #191919"}
                                        fcolor={"white"} bgcolor={duration == 30 ? "#191919" : "black"}
                                        border="1.5px solid rgba(255, 255, 255, 0.7)"
                                        fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                                </ButtonBox01>
                                <ButtonBox01 onClick={() => {
                                    update_duration(50);
                                }}>
                                    <CustomBtn
                                        width={"100%"} height="50px"
                                        hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)"
                                        str="50 DAYS" fsize={"16px"} hborder={"1px solid #191919"}
                                        fcolor={"white"} bgcolor={duration == 50 ? "#191919" : "black"}
                                        border="1.5px solid rgba(255, 255, 255, 0.7)"
                                        fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                                </ButtonBox01>
                            </LetterBox04>
                            <Box display={"flex"} mt="30px" width={"100%"} justifyContent="space-between">
                                <Box display={"flex"}>
                                    <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"}>
                                        Lock period:
                                    </Box>
                                    <Box display={"flex"} color="white" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"} ml="10px">
                                        {duration} days
                                    </Box>
                                </Box>
                                <LetterBox06>
                                    <Box display={"flex"} color="white" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"}>APR Rate</Box>
                                </LetterBox06>
                            </Box>
                            <Box display={"flex"} mt="10px" width={"100%"} justifyContent="space-between">
                                <Box display={"flex"}>
                                    <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"}>
                                        Early unstake fee:
                                    </Box>
                                    <Box display={"flex"} color="white" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"} ml="10px">
                                        {early_unstake_fee}%
                                    </Box>
                                </Box>
                                <LetterBox06>
                                    <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"45px"}>
                                        {current_apr} %
                                    </Box>
                                </LetterBox06>
                            </Box>
                            <Box display={"flex"} mt="10px" width={"100%"} justifyContent="space-between">
                                <Box display={"flex"}>
                                    <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"}>
                                        Status:
                                    </Box>
                                    <Box display={"flex"} color="white" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"} ml="10px">
                                        Unlocked
                                    </Box>
                                </Box>
                                <LetterBox06>
                                    <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"}>
                                        *APR is dynamic
                                    </Box>
                                </LetterBox06>
                            </Box>


                            <LetterBox07>
                                <Box display={"flex"} color="white" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"}>APR Rate</Box>
                                <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"45px"}>
                                    {total_apy} %
                                </Box>
                                <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Inter'} fontSize="16px" lineHeight={"45px"}>
                                    *APR is dynamic
                                </Box>
                            </LetterBox07>
                            <Box display={"flex"} mt="50px" width={"100%"} >
                                <Box display={"flex"}>
                                    <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="16px" lineHeight={"19px"}>
                                        Balance:
                                    </Box>
                                    <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="16px" lineHeight={"19px"} ml="10px">
                                        {balance.toFixed(2)} WARMIZ
                                    </Box>
                                </Box>
                            </Box>
                            <LetterBox05>
                                {/* <CustomInput width={"55%"} height="60px" fsize={"16px"} fcolor={"white"} bgcolor="black" border="1px solid #F5841F" /> */}
                                <Box width={"55%"}>
                                    <InputAmount component={"input"} value={stake_amount} placeholder="0.00"
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            set_stake_amount(e.target.value);
                                        }}
                                    />
                                </Box>
                                <ButtonBox01 width={"35%"} onClick={() => {
                                    if (flag_spin_load) {
                                        NotificationManager.error("plz wait for previous transaction.", "Error", 3000);
                                        console.log("plz wait for previous transaction.")
                                    }
                                    else {
                                        if (stake_amount <= 0 || stake_amount > balance) {
                                            NotificationManager.error("Wrong stake amount.", "Error", 3000);
                                            // set_stake_amount(0);
                                        }
                                        else stake();
                                    }
                                }}>
                                    {flag_spin_approve && (
                                        <>
                                            <Box display={"flex"} position={"absolute"}
                                                justifyContent={"center"} alignItems={"center"} marginLeft={"-8%"}>
                                                <TailSpin color="#FFFFFF" height={24} width={24} />
                                            </Box>
                                        </>
                                    )}
                                    <CustomBtn width={"100%"} height="60px" hcolor="white" hgcolor="#E27625" str="STAKE" fsize={"16px"} fcolor={"white"} bgcolor="rgba(255, 255, 255, 0.1)" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                                </ButtonBox01>
                            </LetterBox05>
                            <LetterBox05>
                                <Box width={"55%"}>
                                    {/* <Box display={"flex"}>
                                        <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="18px" alignItems={"center"} lineHeight={"19px"}>
                                            Claimable:
                                        </Box>
                                        <Box display={"flex"} color="white" fontWeight="400" fontFamily={'Russo One'} fontSize="18px" alignItems={"center"} ml="10px">
                                            {user_withdrawable} WARMIZ
                                        </Box>
                                    </Box> */}
                                </Box>
                                <ButtonBox01 width={"35%"} onClick={() => {
                                    console.log("Clicked");
                                    if (flag_spin_load)
                                        NotificationManager.error("plz wait for previous transaction.", "Error.", 3000);
                                    if (user_withdrawable <= 0)
                                        NotificationManager.error("No reward claimable.", "Error.", 3000);
                                    else claim();
                                }}>
                                    {flag_spin_claim && (
                                        <>
                                            <Box display={"flex"} position={"absolute"}
                                                justifyContent={"center"} alignItems={"center"} marginLeft={"-8%"}>
                                                <TailSpin color="#FFFFFF" height={24} width={24} />
                                            </Box>
                                        </>
                                    )}
                                    <CustomBtn width={"100%"} height="60px" hcolor="white" hgcolor="#E27625" str="CLAIM REWARD" fsize={"16px"} fcolor={"white"} bgcolor="rgba(255, 255, 255, 0.1)" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                                </ButtonBox01>
                            </LetterBox05>
                        </LeftPart02>
                        <Box display={"flex"} flex="0.2"></Box>
                        <RightPart02>
                            <GraphBox01>
                                <Box display={"flex"} flexDirection={"column"} justifyContent="space-between">
                                    <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"24px"}>
                                        {total_stake} WARMIZ
                                    </Box>
                                    <Box display={"flex"} mt={"30px"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="14px" lineHeight={"24px"}>
                                        Total Value Locked
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems="center">
                                    <img src={IMG_Graph01} width="176px" height={"62px"} alt='' />
                                </Box>
                            </GraphBox01>
                            <GraphBox01>
                                <Box display={"flex"} flexDirection={"column"} justifyContent="space-between">
                                    <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"24px"}>
                                        {total_earned} WARMIZ
                                    </Box>
                                    <Box display={"flex"} mt={"30px"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="14px" lineHeight={"24px"}>
                                        Total Distributed Reward
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems="center">
                                    <img src={IMG_Graph01} width="176px" height={"62px"} alt='' />
                                </Box>
                            </GraphBox01>
                            <GraphBox01>
                                <Box display={"flex"} flexDirection={"column"} justifyContent="space-between">
                                    <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"24px"}>
                                        {apr} %
                                    </Box>
                                    <Box display={"flex"} mt={"30px"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="14px" lineHeight={"24px"}>
                                        APR
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems="center">
                                    <img src={IMG_Graph02} width="176px" height={"62px"} alt='' />
                                </Box>
                            </GraphBox01>
                            <GraphBox01>
                                <Box display={"flex"} flexDirection={"column"} justifyContent="space-between">
                                    <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"24px"}>
                                        {total_stakers}
                                    </Box>
                                    <Box display={"flex"} mt={"30px"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="14px" lineHeight={"24px"}>
                                        Number of Stakers
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems="center">
                                    <img src={IMG_Graph03} width="176px" height={"62px"} alt='' />
                                </Box>
                            </GraphBox01>
                            <GraphBox01>
                                <Box display={"flex"} flexDirection={"column"} justifyContent="space-between">
                                    <Box display={"flex"} color="#7DAD3A" fontWeight="400" fontFamily={'Russo One'} fontSize="30px" lineHeight={"24px"}>
                                        {timerComponent}
                                    </Box>
                                    <Box display={"flex"} mt={"30px"} color="rgba(255, 255, 255, 0.7)" fontWeight="400" fontFamily={'Russo One'} fontSize="14px" lineHeight={"24px"}>
                                        Next rewards released in
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems="center">
                                    <img src={IMG_Graph03} width="176px" height={"62px"} alt='' />
                                </Box>
                            </GraphBox01>
                            <Box display={"flex"}></Box>
                        </RightPart02>
                    </UpPart01>
                    <DownPart01>
                        <Box display={"flex"} width={"100%"} justifyContent={"center"} mt={"50px"} color="white" fontWeight="400" fontFamily={'Russo One'} fontSize="24px" lineHeight={"29px"}>
                            Total Value Locked
                        </Box>
                        <Box display={"flex"} width={"100%"} mt="20px" border={"1px solid #F5841F"}></Box>
                        {/* <Box display={"flex"} width={"100%"} justifyContent={"space-between"} mt={"20px"}>
                            <CustomBtn width={"23%"} height="50px" hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)" hborder={"1px solid black"} str="DATE" fsize={"16px"} fcolor={"white"} bgcolor="black" border="1.5px solid rgba(255, 255, 255, 0.7)" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                            <CustomBtn width={"23%"} height="50px" hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)" hborder={"1px solid black"} str="FROM" fsize={"16px"} fcolor={"white"} bgcolor="black" border="1.5px solid rgba(255, 255, 255, 0.7)" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                            <CustomBtn width={"23%"} height="50px" hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)" hborder={"1px solid black"} str="TO" fsize={"16px"} fcolor={"white"} bgcolor="black" border="1.5px solid rgba(255, 255, 255, 0.7)" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                            <CustomBtn width={"23%"} height="50px" hcolor="#7DAD3A" hgcolor="rgba(255, 255, 255, 0.1)" hborder={"1px solid black"} str="HERE" fsize={"16px"} fcolor={"white"} bgcolor="black" border="1.5px solid rgba(255, 255, 255, 0.7)" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                        </Box> */}
                        <TableBox01>
                            <TableHeaderText00>
                                <TableTab01 borderRight={"1px solid rgba(255, 255, 255, 0.08)"}>ACTIVE</TableTab01>
                                <TableTab01 borderRight={"1px solid rgba(255, 255, 255, 0.08)"}>INACTIVE</TableTab01>
                                <TableTab02 borderRight={"1px solid #E27625"}>
                                    <Box display={"flex"} ml="30px">DATE:</Box>
                                    <Box display={"flex"} mr={"30px"}>{getNowDate()}</Box>
                                </TableTab02>
                                <TableTab03 pl={"30px"}>ACTIVE</TableTab03>
                            </TableHeaderText00>
                            <TableHeaderText01>
                                <ElementText01 display={"flex"} flex="0.8">Pools</ElementText01>
                                <ElementText01 display={"flex"} flex="1">Staked amount</ElementText01>
                                {/* <ElementText01 display={"flex"} flex="1">reward amount</ElementText01> */}
                                <ElementText01 display={"flex"} flex="1">Start date</ElementText01>
                                <ElementText01 display={"flex"} flex="1">End date</ElementText01>
                                <ElementText01 display={"flex"} flex="0.8">APR %</ElementText01>
                                <ElementText01 display={"flex"} flex="0.8"></ElementText01>
                            </TableHeaderText01>
                            <TableHeaderLine01></TableHeaderLine01>
                            {
                                user_pools && user_pools.map((pool, index) => {
                                    return (
                                        <>
                                            <TableHeaderText01>
                                                <ElementText01 display={"flex"} flex="0.8">
                                                    <CustomRadio display={"flex"} justifyContent="center" alignItems={"center"}>
                                                        <input type="radio" checked="checked" name="radio" />
                                                        <span class="checkmark"></span>
                                                    </CustomRadio>
                                                    <Box display={"flex"} alignItems="center" ml={"20px"}>
                                                        Pools
                                                    </Box>
                                                </ElementText01>
                                                <ElementText01 display={"flex"} flex="1">{(parseInt(pool.amount._hex) / Math.pow(10, 18)).toFixed(2)} WARMIZ</ElementText01>
                                                {/* <ElementText01 display={"flex"} flex="1">$ {(parseInt(pool.amount._hex) / Math.pow(10, 18) * price).toFixed(2)}</ElementText01> */}
                                                <ElementText01 display={"flex"} flex="1">
                                                    {new Date(parseInt(pool.start._hex) * 1000).toLocaleDateString("en-US")} <br /> {new Date(parseInt(pool.start._hex) * 1000).toLocaleTimeString("en-US")}
                                                </ElementText01>
                                                <ElementText01 display={"flex"} flex="1">
                                                    {new Date(parseInt(pool.end._hex) * 1000).toLocaleDateString("en-US")} <br /> {new Date(parseInt(pool.end._hex) * 1000).toLocaleTimeString("en-US")}
                                                </ElementText01>
                                                <ElementText02 display={"flex"} flex="0.8">{getdynamicAPR(pool.start, pool.end)} %</ElementText02>
                                                <ElementText02 display={"flex"} flex="0.8">
                                                    <Box display={"flex"} width="100%" justifyContent={"flex-end"} alignItems={"center"}
                                                        onClick={() => {
                                                            console.log("end", parseInt(pool.end._hex));
                                                            console.log("now", getNowTimeStamp());
                                                            if (flag_spin_load)
                                                                NotificationManager.error("Wrong staking duration.", "Error.", 3000);
                                                            if (parseInt(pool.end._hex) * 1000 > getNowTimeStamp()) {
                                                                set_spin_withdraw_index(index);
                                                                set_open(true);
                                                            }
                                                            else {
                                                                set_spin_withdraw_index(index);
                                                                withdraw();
                                                            }
                                                        }}
                                                    >
                                                        {flag_spin_withdraw && flag_spin_withdraw_index === index && (
                                                            <>
                                                                <Box display={"flex"} position={"absolute"}
                                                                    justifyContent={"center"} alignItems={"center"} marginRight={"125px"}>
                                                                    <TailSpin color="#FFFFFF" height={24} width={24} />
                                                                </Box>
                                                            </>
                                                        )}
                                                        <CustomBtn width={"140px"} height="43.7px" hcolor="white" hgcolor="#E27625" str="Withdraw" fsize={"16px"} fcolor={"white"} bgcolor="#E27625" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"}
                                                            paddingLeft={flag_spin_withdraw && flag_spin_withdraw_index === index && "20px"}
                                                        />
                                                    </Box>
                                                </ElementText02>
                                            </TableHeaderText01>
                                        </>
                                    )
                                })
                            }
                        </TableBox01>
                        <JoinPart01>
                            <Box display={"flex"} flex="1" justifyContent={"center"} alignItems="center">
                                <JoinBox >
                                    JOIN THE MOVEMENT
                                </JoinBox>
                            </Box>
                            <Box display={"flex"} flex="1" flexDirection={"column"} justifyContent={"flex-start"} alignItems="center" >
                                <Box display={"flex"} width={"80%"} color="rgba(255, 255, 255, 0.7)" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"26px"} textAlign="center" alignContent="center" alignItems="center" justifyContent={"center"}>
                                    Be a part of the most successful all in one crypto project in the space while you earn at the same time!
                                </Box>
                                <Box display={"flex"} marginTop="20px"
                                    onClick={() => { window.open(WARMIZ_JOIN_URL) }}>
                                    <CustomBtn width={"200px"} height="60px" hcolor="white" hgcolor="#E27625" str="JOIN NOW" fsize={"16px"} fcolor={"black"} bgcolor="#F5841F" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                                </Box>
                            </Box>
                        </JoinPart01>
                        <FootterPart01>
                            <SocialBox>
                                <Box display={"flex"} alignItems="center">
                                    <img src={IMG_LeftSlide01} width="73px" height="11px" alt='' />
                                </Box>
                                <Box display={"flex"} ml="30px" color="#F5841F" fontWeight="400" fontFamily={'Russo One'} fontSize="16px" lineHeight={"19px"}>
                                    OUR SOCIALS
                                </Box>
                                <Box display={"flex"} ml="30px" alignItems="center">
                                    <img src={IMG_LeftSlide02} width="73px" height="11px" alt='' />
                                </Box>
                            </SocialBox>
                            <LinkGroupBox >
                                <LinkBox onClick={() => { window.open(TWITTER_URL) }}><FaTwitter /></LinkBox>
                                <LinkBox onClick={() => { window.open(TELEGRAM_URL) }}><FaTelegram /></LinkBox>
                                <LinkBox onClick={() => { window.open(YOUTUBE_URL) }}><FaYoutube /></LinkBox>
                                <LinkBox onClick={() => { window.open(LINKEDIN_URL) }}><FaLinkedin /></LinkBox>
                                <LinkBox onClick={() => { window.open(GITHUB_URL) }}><FaGithub /></LinkBox>
                                <LinkBox onClick={() => { window.open(REDDIT_URL) }}><FaReddit /></LinkBox>
                            </LinkGroupBox>
                            <Box display={"flex"} justifyContent="center" alignItems={"center"} mt="100px" >
                                <img src={IMG_Logo} width={"290px"} height="55px" alt='' />
                            </Box>
                            <FooterLinkBox>
                                <LinkLetter02>Team</LinkLetter02>
                                <LinkLetter02>Timeline</LinkLetter02>
                                <LinkLetter02>WARMIZ</LinkLetter02>
                                <LinkLetter02>GamePlay</LinkLetter02>
                                <LinkLetter02>Merchandise</LinkLetter02>
                                <LinkLetter02>Tokenomics</LinkLetter02>
                                <LinkLetter02>Cash Flow</LinkLetter02>
                                <LinkLetter02>Disclaimer</LinkLetter02>
                            </FooterLinkBox>
                            <Box display={"flex"} justifyContent="center" width={"100%"} alignItems="center" mt={"20px"}>
                                <LinkLetter02>
                                    Copyright © 2022. All Rights Reserved WARMIZ™
                                </LinkLetter02>
                            </Box>
                            <Box display={"flex"} justifyContent="center" width={"100%"} alignItems="center" mt={"100px"} mb={"100px"}>
                                <LinkLetter03>
                                    <MdOutlineKeyboardArrowUp />
                                </LinkLetter03>
                            </Box>
                        </FootterPart01>
                    </DownPart01>

                </Box>
                {/* <Box display={"flex"} flex="1"></Box> */}
            </CenterPart>
            <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <ModalBox>
                    <Box display={"flex"} flex="1" flexDirection={"column"} justifyContent={"flex-start"} alignItems="center" >
                        <Box display={"flex"} color="rgba(255, 255, 255, 0.7)" fontWeight="500" fontFamily={'Inter'} fontSize="16px" lineHeight={"26px"}>
                            Your staking perdiod is not finished yet. Are you sure you want to withdraw and face fees consequences?
                        </Box>
                        <Box display={"flex"} marginTop="20px" onClick={() => {
                            set_open(false);
                            withdraw();
                        }}>
                            <CustomBtn width={"200px"} height="60px" hcolor="white" hgcolor="#E27625" str="YES" fsize={"16px"} fcolor={"black"} bgcolor="#F5841F" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                        </Box>
                        <Box display={"flex"} marginTop="20px" onClick={() => {
                            set_open(false);
                        }}>
                            <CustomBtn width={"200px"} height="60px" hcolor="white" hgcolor="#E27625" str="NO" fsize={"16px"} fcolor={"black"} bgcolor="#F5841F" border="none" fweight={"400"} ffamily={'Russo One'} lheight={"19px"} />
                        </Box>
                    </Box>
                </ModalBox>
            </Modal>
            <NotificationContainer />
        </StyledComponent >
    );
}

const StyledComponent = styled(Box)`
    display: flex;
    width: 100%;
    background: black;
    flex-direction: column;
`

const ModalBox = styled(Box)`
  display: flex;
  width: calc(100vw - 32px);
  max-width: 480px;
  box-sizing: border-box;
  flex-direction: column;
  background-color: #191919;
  border: none;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(100px) !important;
  border-radius: 24px !important;
  padding: 24px;
  transition: box-shadow 300ms;
  transition: transform 505ms cubic-bezier(0, 0, 0.2, 1) 0ms !important;
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
`;

const TopPart = styled(Box)`
    display: flex;
    width: 100%;
    height: 252px;
    background-image: url("images/image.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    @media (max-width: 900px) {
        transition: 0.5s;
        /* background-size:cover; */
    }
`

const ButtonBox01 = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 110px;
    height: 50px;
`

const InputAmount = styled(Box)`
    display: flex;
    width: 100%;
    align-items: center;
    height: 60px;
    font-size: 16px;
    background-color: black!important;
    color: white;
    border: 1px solid #F5841F;
    padding-left: 30px;
    @media (max-width: 900px) {
        transition: 0.5s;
        padding-left: 0px;
    }
`
const LeftPart01 = styled(Box)`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    background-image: url("images/Frame left.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 900px) {
        transition: 0.5s;
        /* display: none; */
    }

`
const CenterPart01 = styled(Box)`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    @media (max-width: 900px) {
        transition: 0.5s;
        display: none;
    }

`
const RightPart01 = styled(Box)`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    background-image: url("images/Frame right.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    align-items: center;
    @media (max-width: 900px) {
        transition: 0.5s;
        /* display: none; */
    }


`
const TopPart01 = styled(Box)`
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 10px;
    margin-left: 50%;
    @media (max-width: 1700px) {
        transition: 0.5s;
        margin-left: 40%;
    }
    @media (max-width: 1400px) {
        transition: 0.5s;
        margin-left: 30%;
    }
    @media (max-width: 700px) {
        transition: 0.5s;
        margin-left: 20%;
    }
    @media (max-width: 550px) {
        transition: 0.5s;
        flex-direction: column;
    }
`
const TopPart02 = styled(Box)`
    display: flex;
    align-items: center;
    font-family: 'Russo One';
    font-style: normal;
    font-weight: 400;
    font-size: 36px;
    line-height: 43px;
    text-transform: uppercase;
    color: #FFFFFF;
    margin-left: 50%;
    @media (max-width: 1700px) {
        transition: 0.5s;
        margin-left: 40%;
    }
    @media (max-width: 1400px) {
        transition: 0.5s;
        margin-left: 30%;
    }
    @media (max-width: 1200px) {
        transition: 0.5s;
        /* margin-left: 10%; */
        font-size: 28px;
    }
    @media (max-width: 700px) {
        transition: 0.5s;
        margin-left: 20%;
    }
    @media (max-width: 600px) {
        transition: 0.5s;
        font-size: 20px;
    }
    @media (max-width: 550px) {
        transition: 0.5s;
        font-size: 15px;
        margin-left: 50%;
    }
`
const ImgPart01 = styled(Box)`
    display: flex;
    margin-left: 10px;
`

const Letter01 = styled(Box)`
    display: flex;
    font-family: 'Russo One';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: rgba(255, 255, 255, 0.7);
    @media (max-width: 1200px) {
        transition: 0.5s;
        font-size: 12px;
    }
    @media (max-width: 600px) {
        transition: 0.5s;
        font-size: 10px;
    }

    @media (max-width: 450px) {
        transition: 0.5s;
        font-size: 8px;
    }
    
`

const Letter02 = styled(Box)`
    display: flex;
    font-family: 'Russo One';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #E27625;
    @media (max-width: 1200px) {
        transition: 0.5s;
        font-size: 12px;
    }
    @media (max-width: 600px) {
        transition: 0.5s;
        font-size: 10px;
    }
    @media (max-width: 450px) {
        transition: 0.5s;
        font-size: 8px;
    }
`
const CenterPart = styled(Box)`
    display: flex;
    width: 100%;
    background-color: black;
    margin-top: 100px;
    box-sizing: border-box;
    padding:0px 200px;
    @media (max-width: 1400px) {
        transition: 0.5s;
        padding:0px 150px;
    }
    @media (max-width: 900px) {
        transition: 0.5s;
        padding:0px 100px;
    }
    @media (max-width: 600px) {
        transition: 0.5s;
        padding:0px 70px;
    }
    @media (max-width: 450px) {
        transition: 0.5s;
        padding:0px 40px;
    }
    @media (max-width: 400px) {
        transition: 0.5s;
        padding:0px 20px;
    }


`
const UpPart01 = styled(Box)`
    display: flex;
    width: 100%;
    flex-direction: row;
    @media (max-width: 1200px) {
        transition: 0.5s;
        flex-direction: column;
    }
    @media (max-width: 600px) {
        transition: 0.5s;
        font-size: 14px !important;
    }
`

const DownPart01 = styled(Box)`
    display: flex;
    width: 100%;
    flex-direction: column;

`
const LeftPart02 = styled(Box)`
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
`
const RightPart02 = styled(Box)`
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: 1200px) {
        transition: 0.5s;
        margin-top: 50px;
    }
`
const TableTab01 = styled(Box)`
    display:  flex;
    flex: 0.5;
    justify-content: center;
    align-items: center;
    font-family: 'Russo One';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    text-transform: uppercase;
    color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:hover{
        cursor: pointer;
        border-bottom: 1px solid #7DAD3A;
    }
`
const TableTab02 = styled(Box)`
    display:  flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    font-family: 'Russo One';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    text-transform: uppercase;
    color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:hover{
        cursor: pointer;
        border-bottom: 1px solid #7DAD3A;
    }
`
const TableTab03 = styled(Box)`
    display:  flex;
    flex: 2;
    justify-content: space-between;
    align-items: center;
    font-family: 'Russo One';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    text-transform: uppercase;
    color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:hover{
        cursor: pointer;
        border-bottom: 1px solid #7DAD3A;
    }
`
const TableHeaderText00 = styled(Box)`
    display: flex;
    width: 100%;
    margin-top: 20px;
    height: 60px;
    min-width: 900px;
`

const TableHeaderText01 = styled(Box)`
    display: flex;
    width: 100%;
    margin-top: 20px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 45px;
    /* or 281% */
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    min-width: 900px;
`
const TableHeaderLine01 = styled(Box)`
    display: flex;
    width: 100%;
    margin-top: 0px;
    border: 1px solid #F5841F;
    min-width: 900px;
`

const ElementText01 = styled(Box)`
    justify-content: center;
    align-items: center;
`
const ElementText02 = styled(Box)`
    color:#7DAD3A;
    justify-content: center;
    align-items: center;
`
const CustomRadio = styled(Box)`
    
`
const JoinPart01 = styled(Box)`
    display: flex;
    width: 100%;
    height: 400px;
    margin-top: 200px;
    background-image: url("images/BGShapes.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    flex-direction: column;
    justify-content: center;
    @media (max-width: 700px) {
        transition: 0.5s;
        height: 500px;
    }
    @media (max-width: 400px) {
        transition: 0.5s;
        height: 600px;
    }
`
const FootterPart01 = styled(Box)`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`
const LinkBox = styled(Box)`
    display: flex;
    flex: 1;
    width: 60px;
    height: 60px;
    color: #F5841F;
    margin-left: auto;
    margin-right: auto;
    font-size: 20px;
    background-image: url("images/link_rect.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    align-items: center;
    justify-content: center;
    &:hover{
        cursor: pointer;
        color: #F5841F;
        transition: .5s;
    }
`
const LinkGroupBox = styled(Box)`
    display: grid;
    margin-top: 60px;
    width: 60%;
    grid-template-columns: auto auto auto auto auto auto auto;
    @media (max-width: 1200px) {
        transition: 0.5s;
        width: 80%;
    }
    @media (max-width: 900px) {
        transition: 0.5s;
        width: 95%;
    }
    @media (max-width: 700px) {
        transition: 0.5s;
        width: 80%;
        grid-template-columns: auto auto auto auto;
        grid-template-rows: auto auto;
        grid-row-gap: 30px;
    }
    @media (max-width: 500px) {
        transition: 0.5s;
        width: 90%;
        grid-template-columns: auto auto auto;
        grid-template-rows: auto auto auto;
        grid-row-gap: 30px;
    }
`
const SocialBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    @media (max-width: 500px) {
        >div:nth-child(1){
            >img{
                transition: 0.5s;
                width: 50px;
                height: 10px;
            }
        }
        >div:nth-child(3){
            >img{
                transition: 0.5s;
                width: 50px;
                height: 10px;
            }
        }
    }
`

const LinkLetter02 = styled(Box)`
    display: flex;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 40px;
    margin-left: auto;
    margin-right: auto;
    /* or 250% */
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
`
const LinkLetter03 = styled(Box)`
    display: flex;
    justify-content: center;
    font-size: 50px;
    color: #F5841F;
`
const LeaderBox = styled(Box)`
    display: flex;
    width: 170px;
    height: 50px;
    margin-left: 25%;
    @media (max-width: 1400px) {
        transition: 0.5s;
    }
    @media (max-width: 1200px) {
        transition: 0.5s;
    }
    @media (max-width: 700px) {
        transition: 0.5s;
        margin-left: 40%;
    }
    @media (max-width: 550px) {
        transition: 0.5s;
        margin-left: 20%;
    }
    @media (max-width: 400px) {
        transition: 0.5s;
        margin-left: 5%;
    }
    >div{
        @media (max-width: 700px) {
            transition: 0.5s;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            transition: 0.5s;
            font-size: 12px;
            width: 140px;
            height: 40px;
            margin-right: 10%;

        }
        @media (max-width: 500px) {
            transition: 0.5s;
            font-size: 10px;
            margin-right: 10%;
        }
    }
`
const LetterBox01 = styled(Box)`
    display: flex;
    color: white;
    font-weight: 400;
    font-family: 'Russo One';
    font-size: 22px;
    line-height: 27px;
`

const LetterBox02 = styled(Box)`
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    flex-direction: row;
    @media (max-width: 700px) {
        transition: 0.5s;
        flex-direction: column;
    }
`
const LetterBox03 = styled(Box)`
    display: flex;
    flex-direction: column;
    @media (max-width: 700px) {
        transition: 0.5s;
        margin-top: 30px;
    }
`
const LetterBox04 = styled(Box)`
    display: grid;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
    grid-template-columns: auto auto auto auto;
    @media (max-width: 700px) {
        transition: 0.5s;
        grid-template-columns:   auto auto;
        grid-template-rows: 80px;
    }
`
const LetterBox05 = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
    align-items: center;

    @media (max-width: 500px) {
        transition: 0.5s;
        flex-direction: column;
        >div:nth-child(1){
            width: 100%;
        }
        >div:nth-child(2){
            margin-top: 10px;
            width: 100%;
        }
    }
    @media (max-width: 400px) {
        transition: 0.5s;
        flex-direction: column;
        >div:nth-child(1){
            width: 100%;
        }
        >div:nth-child(2){
            margin-top: 10px;
            width: 100%;
        }
    }
`
const GraphBox01 = styled(Box)`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    @media (max-width: 500px) {
        transition: 0.5s;
        flex-direction: column;
        margin-bottom: 30px;
        >div:nth-child(2){
            margin-top: 10px;
            margin-bottom: 10px;
        }
    }
`
const LetterBox06 = styled(Box)`
    display: flex;
    @media (max-width: 500px) {
        transition: 0.5s;
        display: none;
    }
`
const LetterBox07 = styled(Box)`
    display: none;
    @media (max-width: 500px) {
        transition: 0.5s;
        display: flex;
        justify-content: space-between;
        >div:nth-child(1){
            font-size: 14px;
        }
        >div:nth-child(2){
            font-size: 20px;
        }
        >div:nth-child(3){
            font-size: 14px;
        }
    }
`
const TableBox01 = styled(Box)`
    display: flex;
    width: 100%;
    flex-direction: column;
    &,*{
        white-space: nowrap;
    }
    @media (max-width: 1200px) {
        transition: 0.5s;
        overflow-x: auto;
    }

    /* @media (max-width: 900px) {
        width: 1200px;
        transition: 0.5s;
        overflow-x: auto;
    } */
    /* max-width: 1200px; */
    /* overflow-x: auto; */
`
const JoinBox = styled(Box)`
    display: flex;
    width: 80%;
    justify-content: center;
    color: white;
    font-weight: 400;
    font-family: "Russo One";
    font-size: 36px;
    line-height: 55px;
    text-align: center;
`
const FooterLinkBox = styled(Box)`
    display: grid;
    width: 70%;
    margin-top: 50px;
    grid-template-columns: auto auto auto auto auto auto auto auto;
    @media (max-width: 1400px) {
        transition: 0.5s;
        width: 100%;
    }
    @media (max-width: 1200px) {
        transition: 0.5s;
        grid-template-columns: auto auto auto auto;
        grid-template-rows: auto auto;
    }
    @media (max-width: 700px) {
        transition: 0.5s;
        width: 100%;
    }
    @media (max-width: 600px) {
        transition: 0.5s;
        grid-template-rows: auto auto auto auto;
        grid-template-columns: auto auto;
    }

`

export const CustomBackdrop = styled(Box)`
    width: 100%;
    height: 100%;
    position: fixed;
    background: white;
    opacity: 0.6;
`

export default Content;
