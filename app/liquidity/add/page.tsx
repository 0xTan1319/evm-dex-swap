"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/swap/topBar";
import { GoArrowLeft } from "react-icons/go";
import { CRO, CROGINAL } from "../../abis/Tokens";
import InputTag from "@/app/components/swap/inputTag";
import ShowPercent from "@/app/components/liquidity/ShowPercent";
import { addLiquidityETH, createPair, getPair } from "@/app/utils/actions";
import { useAccount } from "wagmi";
import { addLiquidity } from "@/app/utils/actions";
import { Address, maxUint256, zeroAddress } from "viem";
import { config } from "@/app/config/wagmi";
import { DEXRouter } from "@/app/config";
import { approve } from "@/app/utils/actions";
import { useChainId } from "wagmi";
import ActionButton from "@/app/components/swap/ActionButton";
import { cronos } from "wagmi/chains";
import { ethers } from "ethers";
import { waitForTransactionReceipt } from "wagmi/actions";
import { TiWarning } from "react-icons/ti";
import { readContract } from "@wagmi/core";
import { PAIR_ABI } from "@/app/utils";
import { getAmountsOutFromDEX } from "@/app/utils/actions";
import { useBalance } from "wagmi";
import { useApprovedStatus } from "@/app/hooks/useApprovedStatus";
import useLPStatusByAccount from "@/app/hooks/useLPStatusByAccount";
import useLPPair from "@/app/hooks/useLPPair";
import { Token } from "@/app/types";
import { useTotalStatusInSwap } from "@/app/hooks/useTotalStatusInSwap";
import { useUSDprice } from "@/app/hooks/useUSDprice";
import { useTokenBalance } from "@/app/hooks/useTokenBalance";
import BottomBar from "@/app/components/bottomBar";

export default function Home() {
  const chainId = useChainId();
  const [baseToken, setBaseToken] = useState(CRO);
  const [quoteToken, setQuoteToken] = useState(CROGINAL);
  const [baseAmount, setBaseAmount] = useState(0);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  //------------------------------------------------------------------
  // 1 : finish approve and create pair, need add liquidity
  // 0 : need create pair, and then have to approve
  // 2 : finish create pair, need approve 1 and 2
  // 3 : need approve only 1
  // 4 : need approve only 2
  //-----------------------------------------------------------------

  const [fixedVal1, setFixedVal1] = useState(0);
  const [fixedVal2, setFixedVal2] = useState(0);

  const router = useRouter();
  const { isConnected, address } = useAccount();

  const [receiveBaseAmount, setReceiveBaseAmount] = useState(0);
  const [receiveQuoteAmount, setReceiveQuoteAmount] = useState(0);

  const [showPoolInfo, setShowPoolInfo] = useState(false);
  const [isAmountCalcing, setIsAmountCalcing] = useState(false);

  const basePrice = useUSDprice(baseToken, baseAmount);
  const quotePrice = useUSDprice(quoteToken, quoteAmount);

  const { isCreated, address: pair } = useLPPair(
    baseToken,
    quoteToken,
    isProcessing
  );
  const { balance, totalSupply } = useLPStatusByAccount(pair as Address, baseToken);

  const sharePercent = useMemo(
    () => (totalSupply ? (balance / totalSupply) * 100 : 0),
    [balance, totalSupply]
  );

  // const { data: baseBalance } = useBalance({
  //   address: address,
  //   unit: baseToken.isNative ? "ether" : undefined,
  //   token: baseToken.isNative ? undefined : (baseToken.address as Address),
  // });

  // const { data: quoteBalance } = useBalance({
  //   address: address,
  //   unit: quoteToken.isNative ? "ether" : undefined,
  //   token: quoteToken.isNative ? undefined : (quoteToken.address as Address),
  // });

  const baseBalance = useTokenBalance(baseToken, isProcessing);
  const quoteBalance = useTokenBalance(quoteToken, isProcessing);

  const isApprovedBase = useApprovedStatus(baseToken, baseAmount, isProcessing);
  const isApprovedQuote = useApprovedStatus(
    quoteToken,
    quoteAmount,
    isProcessing
  );
  const status = useTotalStatusInSwap(
    isApprovedBase,
    isApprovedQuote,
    isCreated,
    isProcessing,
    baseToken,
    quoteToken
  );

  console.log(
    {
      isApprovedBase,
      isApprovedQuote,
      isCreated,
      isProcessing,
      baseToken,
      quoteToken,
      status,
    },
    "HHHHHHHHHHHHH"
  );

  const Add = useCallback(async () => {
    console.log(baseAmount, quoteAmount, "AAAAAAAAA");
    if (baseAmount == 0 || quoteAmount == 0) return;
    setIsProcessing(true);
    setText("Adding Liqudity");
    const deadlineTime: number = Date.now() + 3600;
    try {
      if (baseToken.isNative) {
        // If one of token is CRO, then use addLiquidityETH
        const res: any = await addLiquidityETH(
          baseAmount,
          quoteToken,
          quoteAmount,
          0,
          0,
          address as Address,
          deadlineTime
        );
      } else if (quoteToken.isNative) {
        // If one of token is CRO, then use addLiquidityETH
        const res: any = await addLiquidityETH(
          quoteAmount,
          baseToken,
          baseAmount,
          0,
          0,
          address as Address,
          deadlineTime
        );
      } else {
        const res: any = await addLiquidity(
          baseToken,
          quoteToken,
          baseAmount,
          quoteAmount,
          0,
          0,
          address as Address,
          deadlineTime
        );
      }
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  }, [baseToken, quoteToken, baseAmount, quoteAmount]);

  const create = useCallback(async () => {
    setIsProcessing(true);
    setText("Creating Pool");
    try {
      const res: any = await createPair(baseToken, quoteToken);
      // setStatus(2);
    } catch (error) {
      console.log("create Function:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [baseToken, quoteToken, baseAmount, quoteAmount]);

  const tokenApprove = useCallback(
    async (token: Token) => {
      try {
        setIsProcessing(true);
        setText(`Approving ${token.symbol}`);
        const r = await approve(
          config,
          token,
          ethers.MaxUint256,
          DEXRouter as Address
        ).then(async (hash: any) => {
          await waitForTransactionReceipt(config, { hash });
        });
      } catch (error) {
        console.log("approve1 error", error);
        setIsProcessing(false);
      } finally {
        setIsProcessing(false);
      }
    },
    [status]
  );

  const Approve = useCallback(async () => {
    console.log("Approve clicked", status);
    if (status === 2) {
      await tokenApprove(baseToken);
      await tokenApprove(quoteToken);
      // setStatus(1);
      return;
    }
    if (status === 3) {
      await tokenApprove(baseToken);
      // setStatus(1);
    } else if (status === 4) {
      await tokenApprove(quoteToken);
      // setStatus(1);
    }
  }, [baseToken, quoteToken, status]);

  const getReceiveAmount = useCallback(async () => {
    try {
      const pairAddress: any = await getPair(baseToken, quoteToken);
      const res: any = await readContract(config, {
        abi: PAIR_ABI,
        functionName: "getReserves",
        address: pairAddress as Address,
        args: [],
      });
      console.log("!@", res);

      const first: any = res[0];
      const first1: any = Number(first) / 10 ** 18;
      setReceiveBaseAmount(first1.toFixed(2));
      const two: any = res[1];
      const two2: any = Number(two) / 10 ** 18;
      setReceiveQuoteAmount(two2.toFixed(2));

      return res;
    } catch (error) {
      console.log("getreserve error", error);
      // toast.error("get reserves error");
      return false;
    }
  }, [baseToken, quoteToken]);

  const getRes = getReceiveAmount();

  useEffect(() => {
    const load = async () => {
      if (isCreated) {
        if (
          baseAmount > 0 &&
          receiveBaseAmount != 0 &&
          receiveQuoteAmount != 0
        ) {
          setIsAmountCalcing(true);
        }
        // selected tokens are paired
        // if (receiveBaseAmount == 0 && receiveQuoteAmount == 0)
        //   setShowTopTip(false);

        // setStatus(2);
        let res: any;
        res = await getAmountsOutFromDEX(quoteToken, baseToken, 1);
        setFixedVal2(res);
        res = await getAmountsOutFromDEX(baseToken, quoteToken, 1);
        setFixedVal1(res);
        if (Number(res) != 0) {
          console.log(
            "🚀 ~ load ~ res:",
            res,
            Number(res) != 0,
            res != undefined,
            !isNaN(res)
          );
          const m: any = Number(baseAmount * res).toFixed(3);
          setQuoteAmount(m);
        }
        setIsAmountCalcing(false);
      } else {
        // setShowTopTip(true);
        setFixedVal1(0);
        setFixedVal2(0);
      }
      // if (baseAmount > 0) toast.warning("W");
      // console.log("ShowTopTip : ", showTopTip);
    };
    load();
    setShowPoolInfo(true);
  }, [baseAmount, baseToken, quoteToken]);

  return (
    <>
      <TopBar />
      <div className="flex justify-center mt-[50px] mx-16">
        <h1 className="text-white text-center sm:text-[30px] text-[23px] animate-pulse">
          Swap your tokens or provide liquidity!
        </h1>
      </div>
      <div className="flex justify-center place-items-center mx-2 mb-[10px]">
        {/* <LoadingGif isLoading={isProcessing1} /> */}
        <div className="flex flex-col w-full max-w-[563px]   bg-black-1 rounded-lg drop-shadow-xl mt-[20px] px-[22px] py-[16px]">
          <div className="flex">
            <div className="flex justify-between">
              <div
                onClick={() => {
                  router.push("/liquidity");
                }}
                className="flex items-center text-[17px] hover:cursor-pointer"
              >
                <GoArrowLeft className="text-white text-[25px]" />
              </div>
            </div>
            <div className="flex w-full justify-center">
              <h1 className="font-mono text-white sm:text-[25px] text-[20px]">
                Add Liquidity
              </h1>
            </div>
          </div>
          {!isCreated ? (
            <div className="flex gap-3 items-center h-auto py-4 border  px-5 border-black-border mt-5 rounded-lg">
              <TiWarning className="text-white text-[28px]" />
              <div className="flex flex-col gap-1">
                <h1 className="text-white/60 text-[16px]">
                  You are the first liquidity provider for this token pair.
                </h1>
                <h1 className="text-white/60 text-[16px]">
                  The ratio of tokens you add sets the initial price of this
                  pool.
                </h1>
                <h1 className="text-white/60 text-[16px]">
                  Once you are happy with the rate click supply to review.
                </h1>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col justify-center mt-5">
            <InputTag
              balance={baseBalance}
              amount={baseAmount}
              opToken={quoteToken}
              setAmount={setBaseAmount}
              token={baseToken}
              setToken={setBaseToken}
              no={0}
              isAmountCalcing={0}
              isInvalid={0}
              setIsInsufficient={() => {}}
              USDprice={basePrice}
              showMAXbtn={true}
            />
            <div className="flex justify-center mt-1 -mb-6">
              <h1 className="text-white text-[30px]">+</h1>
            </div>
            <InputTag
              balance={quoteBalance}
              amount={quoteAmount}
              opToken={baseToken}
              setAmount={setQuoteAmount}
              token={quoteToken}
              setToken={setQuoteToken}
              no={0}
              isAmountCalcing={isAmountCalcing}
              isInvalid={0}
              setIsInsufficient={() => {}}
              USDprice={quotePrice}
              showMAXbtn={true}
            />
            {showPoolInfo ? (
              <>
                <h1 className="font-mono w-[240px] text-balance text-sm z-10 bg-black-1 ml-4 px-2 mt-5 -mb-7">
                  Initial prices and pool share
                </h1>
                <div className="flex sm:flex-row flex-col justify-between grid-cols-3 items-center sm:h-[150px] h-[300px] justify border sm:py-0 py-5  px-5 border-black-border my-5 rounded-lg">
                  <ShowPercent
                    baseToken={baseToken}
                    baseAmount={baseAmount}
                    quoteToken={quoteToken}
                    quoteAmount={quoteAmount}
                    status={status}
                    fixedVal={fixedVal1}
                  />
                  <ShowPercent
                    baseToken={quoteToken}
                    baseAmount={quoteAmount}
                    quoteToken={baseToken}
                    quoteAmount={baseAmount}
                    status={status}
                    fixedVal={fixedVal2}
                  />
                  <div className="flex flex-col justify-center items-center gap-4">
                    {(baseAmount === 0 || quoteAmount === 0) && status == 0 ? (
                      <h1 className="text-white text-[17px]">---</h1>
                    ) : (
                      <h1 className="text-white text-[17px]">
                        {Number(sharePercent).toFixed(3)}%
                      </h1>
                    )}

                    <h1 className="text-white text-[16px]">
                      Share in Trading Pair
                    </h1>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6"></div>
            )}

            {!isConnected || chainId != cronos.id ? (
              <ActionButton callback={undefined} text="" />
            ) : isProcessing ? (
              <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                  {text}
                </h1>
              </button>
            ) : baseAmount == 0 || quoteAmount == 0 ? (
              <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                  Input Amount
                </h1>
              </button>
            // ) : baseAmount > Number(baseBalance?.formatted) ||
              // quoteAmount > Number(quoteBalance?.formatted) ? (
            ) : baseAmount > Number(baseBalance) ||
              quoteAmount > Number(quoteBalance) ? (
              <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                  Insufficient Balance
                </h1>
              </button>
            ) : status === 1 ? (
              <>
                <button
                  onClick={Add}
                  className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                >
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    Add Liquidity
                  </h1>
                </button>
              </>
            ) : status === 2 ? (
              <>
                <button
                  onClick={Approve}
                  className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                >
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    Approve {baseToken.symbol} and {quoteToken.symbol}
                  </h1>
                </button>
              </>
            ) : status === 3 ? (
              <>
                <button
                  onClick={Approve}
                  className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                >
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    Approve {baseToken.symbol}
                  </h1>
                </button>
              </>
            ) : status === 4 ? (
              <>
                <button
                  onClick={Approve}
                  className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                >
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    Approve {quoteToken.symbol}
                  </h1>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={create}
                  className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                >
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    Create Pair
                  </h1>
                </button>
              </>
            )}
          </div>
          {/* )} */}
        </div>
      </div>
      <BottomBar />
    </>
  );
}
