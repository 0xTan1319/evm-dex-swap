"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/swap/topBar";
import { IoMdAdd } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";
import TokenModal from "@/app/components/swap/tokenModal";
import { DEXRouter } from "@/app/config";
import { SlArrowDown } from "react-icons/sl";
import { getPair, removeLiquidity } from "@/app/utils/actions";
import { toast } from "react-toastify";
import { Address, maxUint256, zeroAddress } from "viem";
import { useAccount, useSwitchAccount } from "wagmi";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { Abis, DEX_ABI, PAIR_ABI } from "@/app/utils";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/app/config/wagmi";
import { removeLiquidityETH } from "@/app/utils/actions";
import ShowBalance from "@/app/components/swap/showBalance";
import { LuArrowDown } from "react-icons/lu";
// import { Slider } from "@nextui-org/react";
// import { Slider } from 'primereact/slider';
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { waitForTransactionReceipt } from "wagmi/actions";
import LoadingGif from "@/app/components/swap/loadingGif";
import ActionButton from "@/app/components/swap/ActionButton";
import { useChainId } from "wagmi";
import { cronos } from "wagmi/chains";
import { ethers } from "ethers";
import { NATIVE_TOKEN, TOKEN_LIST } from "@/app/abis/Tokens";
import useLPStatusByAccount from "@/app/hooks/useLPStatusByAccount";
import useLPPair from "@/app/hooks/useLPPair";
import { ERC20_ABI } from "../../utils";
import { useApprovedStatusPair } from "@/app/hooks/useApprovedStatusPair";
import BottomBar from "@/app/components/bottomBar";

export default function Home() {
  const chainId = useChainId();
  const [displayMode, setDisplayMode] = useState(0);
  const [baseToken, setBaseToken] = useState(TOKEN_LIST[4]);
  const [quoteToken, setQuoteToken] = useState(TOKEN_LIST[0]);
  const [amount, setAmount] = useState(0);
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const btnArray: number[] = [25, 50, 75, 100];

  const [isSwapping, setIsSwapping] = useState(false);

  const [isFocus, setIsFocus] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isModal1Open, setIsModal1Open] = useState(false);
  const openModal1 = () => setIsModal1Open(true);
  const closeModal1 = () => setIsModal1Open(false);

  // const [receiveBaseAmount, setReceiveBaseAmount] = useState(0);
  // const [receiveQuoteAmount, setReceiveQuoteAmount] = useState(0);

  const [showReceive1, setShowReceive1] = useState(0);
  const [showReceive2, setShowReceive2] = useState(0);
  const [sliderPercent, setSliderPercent] = useState(0);

  // const [receiveOutOrder, setReceiveOutOrder] = useState<boolean>(false); // false: show origin,  true: show mirrow == Cro / croginal or croginal / cro

  const { isCreated, address: pair } = useLPPair(
    baseToken,
    quoteToken,
    isSwapping
  );
  const {
    balance,
    totalSupply,
    receiveBaseAmount,
    receiveQuoteAmount,
    receiveOutOrder,
  } = useLPStatusByAccount(pair as Address, baseToken);

  const sharePercent = useMemo(
    () => (totalSupply ? (balance / totalSupply) * 100 : 0),
    [balance, totalSupply]
  );

  const removeStatus = useApprovedStatusPair(
    pair as Address,
    DEXRouter,
    amount,
    isSwapping
  );

  const poolStatus = useMemo(() => {
    return balance ? true : false;
  }, [balance, sliderPercent]);

  const checkValue = () => {
    if (sliderPercent === 0) {
      toast.warning("Input correctly");
      return;
    }
  };

  const Remove = useCallback(async () => {
    console.log("Input -remove::", amount, sliderPercent);

    setIsSwapping(true);
    checkValue();

    const deadlineTime: number = Date.now() + 3600;
    console.log("deadline", deadlineTime);

    if (baseToken.isNative || quoteToken.isNative) {
      const pairAddress: any = await getPair(baseToken, quoteToken);
      console.log("RemovePairAdd", pairAddress);
      try {
        const res: any = await removeLiquidityETH(
          baseToken.isNative ? quoteToken : baseToken,
          pairAddress,
          amount,
          0,
          0,
          address as Address,
          deadlineTime
        );
        setIsSwapping(false);
      } catch (error) {
        console.log("Error in removeLiquidityETH", error);
      }
      return;
    }
    try {
      // else, addLiquidity
      const res: any = await removeLiquidity(
        baseToken,
        quoteToken,
        amount,
        0,
        0,
        address as Address,
        deadlineTime
      );
      console.log("&&&", res);
      setIsSwapping(false);
      console.log("removeremoveremove", res);
    } catch (error) {
      console.log("Error in removeLiquidityETH", error);
    }
    // }
  }, [baseToken, quoteToken, amount, sliderPercent]);

  const ApproveForRemove = useCallback(async () => {
    setIsSwapping(true);
    const pairAddress: any = await getPair(baseToken, quoteToken);
    console.log("pairaddress is ", pairAddress);
    const abi =
      baseToken.isNative || quoteToken.isNative ? PAIR_ABI : ERC20_ABI;

    const allowance = await readContract(config, {
      abi,
      address: pairAddress as Address,
      functionName: "allowance",
      args: [address as Address, DEXRouter],
    });

    if (Number(allowance) >= amount * 10 ** 18) {
      setIsSwapping(false);
      return;
    }
    try {
      const appr = await writeContract(config, {
        abi,
        functionName: "approve",
        address: pairAddress as Address,
        args: [DEXRouter, ethers.MaxUint256],
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
    console.log("Allowance---", allowance, amount * 10 ** 18);
  }, [baseToken, quoteToken, amount, sliderPercent]);

  // const getReceiveAmount = async () => {
  //   try {
  //     const pairAddress: any = await getPair(baseToken, quoteToken);
  //     const res: any = await readContract(config, {
  //       abi: PAIR_ABI,
  //       functionName: "getReserves",
  //       address: pairAddress as Address,
  //       args: [],
  //     });
  //     const res_token0: any = await readContract(config, {
  //       abi: PAIR_ABI,
  //       functionName: "token0",
  //       address: pairAddress as Address,
  //       args: [],
  //     });
  //     const res_token1: any = await readContract(config, {
  //       abi: PAIR_ABI,
  //       functionName: "token1",
  //       address: pairAddress as Address,
  //       args: [],
  //     });
  //     if (baseToken.isNative) {
  //       if (
  //         String(NATIVE_TOKEN.address).toLowerCase() !=
  //         String(res_token0).toLowerCase()
  //       )
  //         setReceiveOutOrder(true);
  //       else setReceiveOutOrder(false);
  //     } else {
  //       if (
  //         String(baseToken.address).toLowerCase() !=
  //         String(res_token0).toLowerCase()
  //       )
  //         setReceiveOutOrder(true);
  //       else setReceiveOutOrder(false);
  //     }
  //     const first: any = res[0];
  //     const first1: any = Number(first) / 10 ** 18; // total amount in account
  //     const amt: any = first1 / (totalSupply / balance);
  //     setReceiveBaseAmount(amt.toFixed(2));
  //     const two: any = res[1];
  //     const two2: any = Number(two) / 10 ** 18;
  //     const amt1: any = two2 / (totalSupply / balance);

  //     setReceiveQuoteAmount(amt1.toFixed(2));

  //     return res;
  //   } catch (error) {
  //     console.log("getreserve error", error);
  //     // toast.error("get reserves error");
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   const load = async () => {
  //     // await getBalance();
  //     const res = await getReceiveAmount();
  //     console.log("getreceiveamount", res);
  //   };
  //   load();
  // }, [balance, totalSupply]);

  const handleChange = (e: any) => {
    // console.log("handle", e.target.value);
    let value: number = Number(e.target.value);
    console.log(value, "ASDSFASDF");
    setSliderPercent(value);
    const re1: any = ((receiveBaseAmount * value) / 100).toFixed(2);
    console.log("🚀 ~ handleChange ~ re1:", re1, receiveBaseAmount, value);
    setShowReceive1(re1);
    const re2: any = ((receiveQuoteAmount * value) / 100).toFixed(2);
    console.log("🚀 ~ handleChange ~ re2:", re2, receiveQuoteAmount, value);
    setShowReceive2(re2);
    if (value == 100) value = 99;
    const wa: any = ((balance * value) / 100).toFixed(2);
    setAmount(wa);
  };

  return (
    <>
      {displayMode === 0 ? (
        <>
          <TopBar />
          <div className="flex justify-center mt-[50px] mx-16">
            <h1 className="text-white text-center sm:text-[30px] text-[23px] animate-pulse">
              Swap your tokens or provide liquidity!
            </h1>
          </div>
          <div className="flex justify-center place-items-center mx-2 mb-[10px]">
            <LoadingGif isLoading={isSwapping} />

            <div className="flex flex-col w-full max-w-[563px]   bg-black-1 rounded-lg drop-shadow-xl mt-[20px] px-[22px] py-[16px]">
              <div className="flex justify-between">
                <div
                  onClick={() => {
                    router.push("/liquidity");
                  }}
                  className="flex items-center text-[17px] hover:cursor-pointer"
                >
                  <GoArrowLeft className="text-white text-[25px]" />
                </div>
                <div
                  onClick={() => {
                    router.push("/liquidity/viewpool");
                  }}
                  className="flex items-center text-[17px] mt-2 hover:cursor-pointer hover:underline"
                >
                  <h1 className="text-white font-mono mx-1">
                    View All
                  </h1>
                </div>
              </div>
              <div className="flex flex-col justify-center mt-5">
                <button
                  onClick={openModal}
                  className="w-full flex justify-center transition duration-200 hover:bg-black-border/50 border border-black-border rounded-lg items-center gap-2 py-1.5 px-3 sm:text-[18px] text-[15px] font-semibold text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-none"
                >
                  <Image
                    className="rounded-full"
                    src={`/img/token_icons/${baseToken.symbol}.png`}
                    width={22}
                    height={22}
                    alt=""
                  />
                  {baseToken.symbol}
                  <SlArrowDown className="text-[12px] font-bold" />
                </button>
                <TokenModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  title="Select a Token"
                  opToken={baseToken}
                  otherToken={quoteToken}
                  setToken={setBaseToken}
                />
                <div className="flex justify-center my-5">
                  <h1 className="text-white text-[30px]">{"+"}</h1>
                </div>
                <button
                  onClick={openModal1}
                  className="w-full flex justify-center transition duration-200 hover:bg-black-border/50 border border-black-border rounded-lg items-center gap-2 py-1.5 px-3 sm:text-[18px] text-[15px] font-semibold text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-none"
                >
                  <Image
                    className="rounded-full"
                    src={`/img/token_icons/${quoteToken.symbol}.png`}
                    width={22}
                    height={22}
                    alt=""
                  />
                  {quoteToken.symbol}
                  <SlArrowDown className="text-[12px] font-bold" />
                </button>
                <TokenModal
                  isOpen={isModal1Open}
                  onClose={closeModal1}
                  title="Select a Token"
                  opToken={quoteToken}
                  otherToken={baseToken}
                  setToken={setQuoteToken}
                />
                {!poolStatus ? (
                  <>
                    <div className="flex flex-col gap-5 justify-center items-center h-[150px] border border-black-border my-5  px-8 rounded-lg">
                      <h1 className="text-white font-mono">
                        You don’t have liquidity in this pair yet.
                      </h1>
                      <div
                        onClick={() => {
                          router.push("/liquidity/add");
                        }}
                        className="flex items-center text-[17px] hover:cursor-pointer hover:underline"
                      >
                        <IoMdAdd className="text-white font-mono" />
                        <h1 className="text-white font-mono mx-1">
                          Add liquidity
                        </h1>
                      </div>
                    </div>
                  </>
                ) : poolStatus ? (
                  <div className="flex flex-col gap-4 justify-center items-center h-[190px] border border-black-border my-5  px-5 rounded-lg">
                    <h1 className="text-white font-mono">
                      You have liquidity in this pair.
                    </h1>
                    <h1 className="text-white font-mono">
                      Liquidity balance is <b>{Number(balance).toFixed(3)}</b>
                    </h1>
                    <h1 className="text-white font-mono">
                      Share in trading pair is{" "}
                      <b>{Number(sharePercent).toFixed(3)} %</b>
                    </h1>
                    <div
                      onClick={() => {
                        setDisplayMode(1);
                      }}
                      className="flex items-center text-[17px] hover:cursor-pointer hover:underline"
                    >
                      <IoIosRemoveCircleOutline className="text-white" />
                      <h1 className="text-white font-mono mx-1">
                        Remove Liquidity
                      </h1>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {/* )} */}
            </div>
          </div>
          <BottomBar />
        </>
      ) : (
        <>
          <TopBar />
          <div className="flex justify-center mt-[50px] mx-16">
            <h1 className="text-white text-center sm:text-[30px] text-[23px] animate-pulse">
              Swap your tokens or provide liquidity!
            </h1>
          </div>
          <div className="flex justify-center place-items-center mx-2 mb-[10px]">
            <LoadingGif isLoading={isSwapping} />

            <div className="flex flex-col w-full max-w-[563px]   bg-black-1 rounded-lg drop-shadow-xl mt-[20px] px-[22px] py-[16px]">
              <div className="flex justify-between">
                <div
                  onClick={() => {
                    setDisplayMode(0);
                  }}
                  className="flex items-center text-[17px] hover:cursor-pointer"
                >
                  <GoArrowLeft className="text-white text-[25px]" />
                </div>
              </div>
              <div className="flex flex-col justify-center mt-5">
                <div className="h-auto border  px-5 py-4 border-black-border my-2 rounded-lg">
                  <h1 className="text-white text-[16px] ml-1 mt-3 mb-3">
                    Amount
                  </h1>
                  <div className="flex justify-between">
                    <h1 className="text-white text-[35px] px-6">
                      {sliderPercent}%
                    </h1>
                    <h1 className="text-white text-[35px] px-6">{amount}</h1>
                  </div>
                  <div className="flex justify-center px-1 mt-2">
                    <Box className="w-full">
                      <Slider
                        defaultValue={0}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        onChange={(e) => handleChange(e)}
                        value={Number(sliderPercent)}
                      />
                    </Box>
                  </div>
                  <div className="flex justify-center items-center mt-4">
                    {btnArray.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSliderPercent(item);
                          console.log("slider percent---", sliderPercent);
                          let x = item;
                          if (x == 100) x = 99;
                          const wa: any = ((balance * x) / 100).toFixed(2);
                          setAmount(wa);
                          const re1: any = (
                            (receiveBaseAmount * item) /
                            100
                          ).toFixed(2);
                          setShowReceive1(re1);
                          const re2: any = (
                            (receiveQuoteAmount * item) /
                            100
                          ).toFixed(2);
                          setShowReceive2(re2);
                        }}
                        className="rounded-lg h-[33px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright sm:px-4 px-3 mx-1 my-1"
                      >
                        <h1 className="font-mono text-white sm:text-[16px] text-[14px]">
                          {item}%
                        </h1>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center items-center my-3">
                  <LuArrowDown className="text-white text-[25px]" />
                </div>
                <h1 className="text-white text-[16px] ml-6">Receive</h1>
                <div className="h-auto border  px-[30px] py-6 border-black-border my-2 rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex">
                      <Image
                        className="rounded-full"
                        src={`/img/token_icons/${baseToken.symbol}.png`}
                        width={25}
                        height={25}
                        alt=""
                      />
                      <h1 className="text-white text-[15px] ml-3">
                        {baseToken.symbol}
                      </h1>
                    </div>
                    <h1 className="text-white text-[18px]">
                      {receiveOutOrder == false ? showReceive1 : showReceive2}
                    </h1>
                  </div>
                  <div className="flex justify-between mt-5">
                    <div className="flex">
                      <Image
                        className="rounded-full"
                        src={`/img/token_icons/${quoteToken.symbol}.png`}
                        width={25}
                        height={25}
                        alt=""
                      />
                      <h1 className="text-white text-[15px] ml-3">
                        {quoteToken.symbol}
                      </h1>
                    </div>
                    <h1 className="text-white text-[18px]">
                      {receiveOutOrder == false ? showReceive2 : showReceive1}
                    </h1>
                  </div>
                </div>
                {!isConnected || chainId != cronos.id ? (
                  <ActionButton callback={undefined} />
                ) : removeStatus == true ? (
                  <>
                    <button
                      onClick={Remove}
                      className="w-[100%] sm:h-[46px] h-[38px] mt-2 text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                    >
                      <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                        Remove Liquidity
                      </h1>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={ApproveForRemove}
                    className="w-[100%] sm:h-[46px] h-[38px] mt-2 text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                  >
                    <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                      Approve
                    </h1>
                  </button>
                )}
              </div>
              {/* )} */}
            </div>
          </div>
        </>
      )}
    </>
  );
}
