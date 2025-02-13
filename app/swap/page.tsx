"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { CRO, CROGINAL } from "../abis/Tokens";
import ActionButton from "../components/swap/ActionButton";
import { useAccount, useBalance } from "wagmi";
import InputTag from "../components/swap/inputTag";
import TopBar from "../components/swap/topBar";
import { Address } from "viem";
import { useChainId } from "wagmi";
import { cronos } from "wagmi/chains";
import SetSlippageButton from "../components/swap/setSlippageButton";
import useSwapStatus from "../hooks/useSwapStatus";
import { usePlayDEX } from "../hooks/usePlayDEX";
import { useUSDprice } from "../hooks/useUSDprice";
import { useTokenBalance } from "../hooks/useTokenBalance";
import BottomBar from "../components/bottomBar";

export default function Home() {
  const [baseToken, setBaseToken] = useState(CRO);
  const [quoteToken, setQuoteToken] = useState(CROGINAL);
  const [baseAmount, setBaseAmount] = useState(0);
  const { isConnected, address } = useAccount();
  const [slippagePercent, setSlippagePercent] = useState(0.5);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const btnArray: number[] = [10, 25, 50, 75, 100];
  const router = useRouter();
  const chainId = useChainId();
  const [isInsufficient, setIsInsufficient] = useState(false);

  const basePrice = useUSDprice(baseToken, baseAmount);
  const quotePrice = useUSDprice(quoteToken, quoteAmount);

  const { estimateFee, approveStatus, isSwapping, isAmountCalcing, callback } =
    useSwapStatus(
      baseToken,
      quoteToken,
      baseAmount,
      slippagePercent,
      quoteAmount,
      setQuoteAmount
    );

    // const isSoundSuccess = usePlayDEX(isSwapSuccess, isSwapping, baseAmount, quoteAmount, baseToken, quoteToken);

  // const { data: baseBalance } = useBalance({
  //   address: address,
  //   token: baseToken.isNative ? undefined : (baseToken.address as Address),
  // });

  // const { data: quoteBalance } = useBalance({
  //   address: address,
  //   token: quoteToken.isNative ? undefined : (quoteToken.address as Address),
  // });
  const baseBalance = useTokenBalance(baseToken, isSwapping);
  const quoteBalance = useTokenBalance(quoteToken, isSwapping);

  const swapBaseAndQuote = () => {
    setBaseToken(quoteToken);
    setQuoteToken(baseToken);
    setBaseAmount(quoteAmount);
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
            <div className="w-[50%] h-[33px] border rounded-l-lg border-black-border bg-black-3 text-center items-center hover:cursor-pointer">
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
            <div
              onClick={() => {
                router.push("/staking");
              }}
              className="w-[50%] h-[33px] border rounded-r-lg border-black-border text-center items-center hover:cursor-pointer"
            >
              <h1 className="text-white mt-1">Vault</h1>
            </div>
          </div>

          <div className="flex w-[100%] justify-end mt-5 pr-2">
            <SetSlippageButton setSlippagePercent={setSlippagePercent} />
          </div>
          <InputTag
            balance={baseBalance}
            amount={baseAmount}
            setAmount={setBaseAmount}
            token={baseToken}
            opToken={quoteToken}
            setToken={setBaseToken}
            no={0}
            isAmountCalcing={0}
            isInvalid={isInsufficient}
            setIsInsufficient={setIsInsufficient}
            USDprice={basePrice}
            showMAXbtn={false}
          />
          <div className="flex justify-between items-center mt-5">
            <div className="min-[520px]:ml-[100px] min-[415px]:ml-[50px] ml-[10px]">
              {btnArray.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    let amountOfBase: any =
                      // (Number(baseBalance?.formatted) * item) / 100;
                      (Number(baseBalance) * item) / 100;
                    amountOfBase = Math.floor(Number(amountOfBase) * 1000) / 1000
                    if (baseToken.isNative) amountOfBase -= 5;
                    setBaseAmount(amountOfBase);
                  }}
                  className="rounded-lg h-[33px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright sm:px-4 px-2 mx-1 my-1"
                >
                  <h1 className="font-mono text-white sm:text-[16px] text-[14px]">
                    {
                      item == 100 ? (`MAX`) : (`${item}%`)
                    }
                  </h1>
                </button>
              ))}
            </div>
            <div className="grid justify-items-end hover:cursor-pointer">
              <AiOutlineSwap
                onClick={swapBaseAndQuote}
                className="transition duration-500 text-white hover:text-white/50"
                style={{ transform: "rotate(90deg)" }}
                size={22}
              />
            </div>
          </div>
          <InputTag
            balance={quoteBalance}
            amount={quoteAmount}
            setAmount={setQuoteAmount}
            token={quoteToken}
            opToken={baseToken}
            setToken={setQuoteToken}
            no={1}
            isAmountCalcing={isAmountCalcing}
            isInvalid={0}
            setIsInsufficient={() => { }}
            USDprice={quotePrice}
            showMAXbtn={false}
          />

          <div className="sm:mt-4 mt-6 border border-black-border rounded-md p-1">
            {!isConnected || chainId != cronos.id ? (
              <ActionButton callback={undefined} text="" />
            ) : baseAmount == 0 ? (
              <>
                <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    Input amount
                  </h1>
                </button>
              </>
            ) : isSwapping ? (
              <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                  Swapping ...
                </h1>
              </button>
            ) : isInsufficient ? (
              <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                  Insufficient balance
                </h1>
              </button>
            ) : approveStatus == 1 ? (

              <ActionButton callback={callback} text="Approve" />

            ) : approveStatus == 2 ? (
              <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                  Approving ...
                </h1>
              </button>
            ) : approveStatus == 3 ? (
              <ActionButton callback={callback} text="Swap" />
            ) : (
              <button className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright cursor-not-allowed">
                <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                  Wait...
                </h1>
              </button>
            )}
          </div>
          {baseAmount > 0 ? (
            <div className="flex flex-col gap-2 border rounded-lg border-black-border py-4 px-4 mt-4">
              <div className="flex justify-between">
                <h1 className="text-white font-mono text-[17px]">
                  {`Minimum output`}
                </h1>
                <h1 className="text-white font-mono text-[17px]">
                  {`${((quoteAmount * (100 - slippagePercent)) / 100).toFixed(
                    3
                  )}`}
                </h1>
              </div>

              <div className="flex justify-between">
                <h1 className="text-white font-mono text-[17px]">
                  {`Expected output`}
                </h1>
                <h1 className="text-white font-mono text-[17px]">
                  {`${Number(quoteAmount).toFixed(3)}`}
                </h1>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <BottomBar />
    </>
  );
}
