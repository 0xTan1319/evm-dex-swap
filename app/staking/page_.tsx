"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STAKING_ADDRESS } from "../config";
import ShowBalance from "../components/swap/showBalance";
import LoadingGif from "../components/swap/loadingGif";
import ActionButton from "../components/swap/ActionButton";
import { useAccount, useConfig } from "wagmi";
import TopBar from "../components/swap/topBar";
import { config } from "@/app/config/wagmi";
import { Address } from "viem";
import {
  deposit,
  claimRewards,
  withdrawCroginal,
} from "../utils/actions";
import { readContract, writeContract } from "@wagmi/core";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useChainId } from "wagmi";
import TokenModal from "../components/swap/tokenModal";
import { GiCheckMark } from "react-icons/gi";
import { PAIR_ABI } from "../utils";
import YourLockedValue from "../components/staking/YourLockedValue";
import { cronos } from "wagmi/chains";
// import { getRewardInfo } from "../utils/actions";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CRO, CROGINAL } from "../abis/Tokens";
import useLPPair from "../hooks/useLPPair";
import { Token } from "../types";
import { useStakerInfo } from "../hooks/useStakerInfo";
import { ethers } from "ethers";
import { useApprovedStatusPair } from "../hooks/useApprovedStatusPair";
import { TiWarning } from "react-icons/ti";
import { useMemo } from "react";
import useLPStatusByAccount from "../hooks/useLPStatusByAccount";

export default function Home() {
  const [baseToken, setBaseToken] = useState(CRO);
  const [quoteToken, setQuoteToken] = useState(CROGINAL);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isInsufficient, setIsInsufficient] = useState<boolean>(false);

  const router = useRouter();
  const chainId = useChainId();

  const [isBaseModalOpen, setIsBaseModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const openBaseModal = () => setIsBaseModalOpen(true);
  const closeBaseModal = () => setIsBaseModalOpen(false);
  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);
  const { isConnected, address } = useAccount();

  const [amount, setAmount] = useState(0);
  const config1 = useConfig();
  // const [totalValue, setTotalValue] = useState<number>(0);
  // const [rewardRemainValue, setRewardRemainValue] = useState(1);
  const { isCreated, address: pair } = useLPPair(
    baseToken,
    quoteToken,
    isSwapping
  );

  const {
    staked: yourValue,
    reward: rewards,
    balance: totalBalance,
  } = useStakerInfo(pair as Address, isSwapping);

  const isApproved = useApprovedStatusPair(
    pair as Address,
    STAKING_ADDRESS,
    amount,
    isSwapping
  );

  const { balance, totalSupply } = useLPStatusByAccount(pair as Address, baseToken);

  const apr = useMemo(
    () => (totalSupply ? (balance / totalSupply) * 100 : 0),
    [balance, totalSupply]
  );

  const handleAmountChange = (e: any) => {
    // console.log("handle", e.target.value);
    const value: any = e.target.value;
    console.log(value, "ASDSFASDF");
    if (value > totalBalance) setIsInsufficient(true);
    else setIsInsufficient(false);
    setAmount(value);
  };

  const allClaim = async () => {
    setIsSwapping(true);
    try {
      const res = await claimRewards(config1, pair as Address, apr);
    } catch (error) {
      console.log("allClaim Err:", error);
    }
    setIsSwapping(false);
  };

  const withdrawFunc = async () => {
    setIsSwapping(true);
    try {
      const res = await withdrawCroginal(config1, pair as Address, apr);
    } catch (error) {
      console.log("withdrawErr:", error);
    }
    setIsSwapping(false);
  };

  const ApproveForStake = useCallback(async () => {
    setIsSwapping(true);
    const abi = PAIR_ABI;

    try {
      const appr = await writeContract(config, {
        abi,
        functionName: "approve",
        address: pair as Address,
        args: [STAKING_ADDRESS, ethers.MaxUint256],
      }).then(async (hash) => {
        await waitForTransactionReceipt(config, { hash });
        setIsSwapping(false);
      });
    } catch (error) {
      console.log("approve1 error", error);
      setIsSwapping(false);

      return false;
    }

    setIsSwapping(false);
  }, [baseToken, quoteToken, amount]);

  const depositNew = useCallback(async () => {
    console.log("let's deposit");
    setIsSwapping(true);

    try {
      const res = await deposit(config1, amount * 10 ** 18, pair as Address, apr);
      console.log(amount, "mamamamam");
    } catch (error) {
      console.log("deposit Error!" + error);
    }
    setIsSwapping(false);
  }, [baseToken, quoteToken, amount]);

  const showRemain = (rewardRemainValue: string) => {
    console.log("reward Remain -> " + rewardRemainValue);
    if (rewardRemainValue.length < 5) return rewardRemainValue;
    const start: any = rewardRemainValue.slice(0, 3); // Get first 3 digits
    const end: any = rewardRemainValue.slice(-3); // Get last 3 digits
    return `${start}...`; // Combine with ellipsis
    // return rewardRemainValue;
  };

  return (
    <>
      <TopBar />
      <div className="flex justify-center mt-[50px] mx-16">
        <h1 className="text-white text-center sm:text-[30px] text-[23px] animate-pulse">
          Swap your tokens or provide liquidity!
        </h1>
      </div>
      <div className="flex justify-center place-items-center mx-4">
        {/* <LoadingGif isLoading={isSwapping} /> */}

        <div className="flex flex-col w-full max-w-[563px]  bg-black-1 rounded-lg drop-shadow-xl mt-[20px] px-[22px] py-[16px]">
          <div className="flex">
            <div
              onClick={() => {
                router.push("/swap");
              }}
              className="w-[50%] h-[33px] border rounded-l-lg border-black-border  text-center items-center hover:cursor-pointer"
            >
              <h1 className="text-white mt-1">Swap</h1>
            </div>
            <div
              onClick={() => {
                router.push("/liquidity");
              }}
              className="w-[50%] h-[33px] border border-black-border text-center items-center hover:cursor-pointer"
            >
              <h1 className="text-white mt-1">Liquidity</h1>
            </div>
            <div className="w-[50%] h-[33px] border rounded-r-lg border-black-border bg-black-3 text-center items-center hover:cursor-pointer">
              <h1 className="text-white mt-1">Vault</h1>
            </div>
          </div>

          {!isConnected || chainId != cronos.id ? (
            // <div className="flex flex-col items-center justify-center h-[150px]">
            //   <h1 className="text-white font-mono">
            //     You are not connected to the wallet
            //   </h1>
            //   <h1 className="text-white font-mono">Please connect wallet</h1>
            // </div>
            <ActionButton callback={undefined} />
          ) : (
            <>
              <h1 className="w-[118px] font-mono text-balance text-sm z-10 bg-black-1 ml-6 px-2 mt-6">
                Lp token Info
              </h1>
              <div className="flex flex-col sm:gap-0 gap-6 border rounded-lg border-black-border py-4 px-4 -mt-3">
                {/* <TotalLockedValue value={totalValue} /> */}
                <div className="flex justify-center place-items-center">
                  <div className="flex items-center  justify-center bg-gray-100">
                    <button
                      onClick={openBaseModal}
                      className="w-full inline-flex items-center gap-2 py-1.5 px-3 sm:text-[18px] text-[15px] font-semi text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-none"
                    >
                      {baseToken.symbol}
                      <MdOutlineKeyboardArrowDown className="text-[27px] font-bold" />
                    </button>
                    <TokenModal
                      isOpen={isBaseModalOpen}
                      onClose={closeBaseModal}
                      title="Select a Token"
                      opToken={quoteToken}
                      otherToken={baseToken}
                      setToken={setBaseToken}
                    />
                  </div>
                  <h1 className="w-[10%] text-white text-center text-[20px] sm:mx-4 mx-1">
                    +
                  </h1>
                  <div className="flex items-center  justify-center bg-gray-100">
                    <button
                      onClick={openQuoteModal}
                      className="w-full inline-flex items-center gap-2 py-1.5 px-3 sm:text-[18px] text-[15px] font-semi text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-none"
                    >
                      {quoteToken.symbol}
                      <MdOutlineKeyboardArrowDown className="text-[27px] font-bold" />
                    </button>
                    <TokenModal
                      isOpen={isQuoteModalOpen}
                      onClose={closeQuoteModal}
                      title="Select a Token"
                      opToken={baseToken}
                      otherToken={quoteToken}
                      setToken={setQuoteToken}
                    />
                  </div>

                  <GiCheckMark
                    className={`w-[20%]  ${
                      isCreated ? "text-white" : "text-black-border"
                    } text-[25px]`}
                  />
                  {/* <button
                    onClick={() => setStakingToken(baseToken, quoteToken)}
                    className="sm:h-[38px] h-[27px] px-2 rounded-lg text-gray-txt transition duration-500 bg-black-border hover:bg-purple-bright"
                  >
                    <h1 className="font-mono text-white sm:text-[20px] text-[14px]">
                      Update
                    </h1>
                  </button> */}
                </div>
                <div className="flex flex-col mt-5">
                <h1 className="text-white font-mono sm:text-[18px] text-[15px] px-5">
                    {`Share in Trading Pair : ${Number(apr).toFixed(3)} %`}
                  </h1>
                  <YourLockedValue value={yourValue} />
                  <h1 className="text-white font-mono sm:text-[18px] text-[15px] px-5">
                    {`Rewards : ${rewards}`}
                  </h1>
                </div>
              </div>

              {!isCreated ? (
                <div className="flex gap-3 items-center h-auto py-4 border  px-5 border-black-border mt-5 rounded-lg">
                  <TiWarning className="text-white text-[28px]" />
                  <div className="flex flex-col place-items-center w-full gap-1">
                    <h1 className="text-white/60 text-[16px]">
                      There is no token pair yet.
                    </h1>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="w-[70px] font-mono text-balance text-sm z-10 bg-black-1 ml-6 px-2 mt-6">
                    Staking
                  </h1>
                  <div className="flex flex-col sm:gap-0 gap-6 border rounded-lg border-black-border py-4 px-4 -mt-3">
                    <div className="">
                      <div className="flex grid justify-items-end mt-5">
                        <div className="flex">
                          <ShowBalance balance={totalBalance} />
                        </div>
                      </div>
                      <div className="flex justify-between sm:h-[55px] h-[40px] border border-black-border px-[15px] -mt-[11px] mb-6">
                        <input
                          onChange={handleAmountChange}
                          value={amount ? amount : ""}
                          className="numberInput bg-transparent disabled:cursor-not-allowed w-[100%] text-left outline-none sm:text-[20px] text-[16px] font-mono sm:h-[55px] h-[40px] text-white transition-colors"
                          placeholder="deposit amount"
                          type="number"
                        />
                      </div>
                    </div>

                    {!amount ? (
                      <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                        <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                          Input amount
                        </h1>
                      </button>
                    ) : isSwapping ? (
                      <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                        <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                          Wait ...
                        </h1>
                      </button>
                    ) : isApproved ? (
                      isInsufficient ? (
                        <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                          <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                            Insufficient Balance
                          </h1>
                        </button>
                      ) : (
                        <button
                          onClick={depositNew}
                          className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                        >
                          <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                            Stake
                          </h1>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={ApproveForStake}
                        className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                      >
                        <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                          Approve
                        </h1>
                      </button>
                    )}
                    {isCreated ? (
                      <div className="flex flex-col">
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={allClaim}
                            // onClick={ApproveForStake}111
                            // onMouseEnter={() => setToolTipFlg(1)}
                            // onMouseLeave={() => setToolTipFlg(0)}
                            className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-black-border hover:bg-purple-bright"
                          >
                            <div className="">
                              <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                                {/* Claim ( {showRemain(rewardRemainValue)} ) */}
                                Claim
                              </h1>
                              {/* {tooltipFlg === 1 ? (
                      <div className="tooltip absolute bg-red text-white text-lg rounded-lg p-2 whitespace-nowrap left-1/2 transform -translate-x-1/2 -translate-y-full">
                        {rewardRemainValue}
                      </div>
                    ) : (
                      <div className="tooltip absolute hidden bg-gray-700 text-white text-lg rounded-lg p-2 whitespace-nowrap left-1/2 transform -translate-x-1/2 -translate-y-full">
                        {rewardRemainValue}
                      </div>
                    )} */}
                            </div>
                          </button>
                          <button
                            // onClick={ApproveForStake}
                            onClick={withdrawFunc}
                            className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-black-border hover:bg-purple-bright"
                          >
                            <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                              Withdraw
                            </h1>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

    </>
  );
}
