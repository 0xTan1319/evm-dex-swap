"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/swap/topBar";
import { GoArrowLeft } from "react-icons/go";
import {
  getPairInfoFromBackend,
  getTokenBalanceByAddress,
  convertBignitTofloat,
} from "@/app/utils/actions";
import * as React from "react";
import { LPPair } from "@/app/types/pair";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { erc20Abi } from "viem";
import { config } from "@/app/config/wagmi";
import { multicall } from "@wagmi/core";
import LoadingGif from "@/app/components/swap/loadingGif";
import BottomBar from "@/app/components/bottomBar";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();

  const [isSwapping, setIsSwapping] = useState(false);
  const [userPool, setUserPool] = useState<LPPair[]>([]); // pool that user have

  useEffect(() => {
    const load = async () => {
      setIsSwapping(true);
      let pairInfo: any = await getPairInfoFromBackend();
      const contracts: any[] = [];
      for (let i = 0; i < pairInfo.length; i++) {
        // let balance: any = await getTokenBalanceByAddress(
        //   pairInfo[i].pairAddress,
        //   address as Address
        // );
        contracts.push(
          {
            abi: erc20Abi,
            functionName: "balanceOf",
            address: pairInfo[i].pairAddress as Address,
            args: [address as Address],
          }
          // {
          //   abi: erc20Abi,
          //   functionName: "decimals",
          //   address: pairInfo[i].pairAddress as Address,
          // }
        );
      }
      const resultofCall: any = await multicall(config, { contracts });
      const userPool: any[] = [];
      for (let i = 0; i < resultofCall.length; i++) {
        if (resultofCall[i].result > 0) userPool.push(pairInfo[i]);
      }
      setUserPool(userPool);
      setIsSwapping(false);
      // if (tokenBalance.result != undefined && decimals.result != undefined) {
      //   const formatedTokenBalance = convertBignitTofloat(
      //     tokenBalance[i].result,
      //     decimals[i].result
      //   );
      //   return formatedTokenBalance;
      // }
      // return 0;
      // console.log("@:", pairInfo[i].pairAddress, balance);
    };
    load();
  }, []);

  return (
    <>
      <TopBar />
      <div className="flex justify-center mt-[50px] mx-16">
        <h1 className="text-white text-center sm:text-[30px] text-[23px] animate-pulse">
          Swap your tokens or provide liquidity!
        </h1>
      </div>
      <div className="flex justify-center place-items-center mx-2 mb-[10px]">
        <div className="flex flex-col w-full max-w-[563px]   bg-black-1 rounded-lg drop-shadow-xl mt-[20px] px-[22px] py-[16px]">
          <div className="flex justify-between">
            <div
              onClick={() => {
                router.push("/liquidity/import");
              }}
              className="flex items-center text-[17px] hover:cursor-pointer"
            >
              <GoArrowLeft className="text-white text-[25px]" />
            </div>
          </div>
          <div className="flex flex-col justify-center mt-5">
            <LoadingGif isLoading={isSwapping} />
            <table className="table-fixed w-full text-white text-center sm:text-[18px] text-[15px]">
              <thead className="h-6">
                <tr className="text-white/60 py-4">
                  <th className="w-[20%]">No</th>
                  <th className="w-[80%]">Pool</th>
                </tr>
              </thead>
              <tbody className="">
                {userPool.map((item, index) => (
                  <tr
                    key={index}
                    className={`text-white mt-1 hover:bg-black-border/30 cursor-pointer ${
                      index % 2 != 1 ? "bg-black-border/20" : ""
                    }`}
                  >
                    <td>{index + 1}</td>
                    <td className="w-full flex justify-center transition duration-200 rounded-lg items-center gap-2 py-1.5 px-3 sm:text-[18px] text-[15px]  text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-none">
                      <Image
                        className="rounded-full"
                        src={`/img/token_icons/${item.token1}.png`}
                        width={22}
                        height={22}
                        alt=""
                      />
                      {item.token1}
                      <h1> /</h1>
                      <Image
                        className="rounded-full"
                        src={`/img/token_icons/${item.token2}.png`}
                        width={22}
                        height={22}
                        alt=""
                      />
                      {item.token2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* )} */}
        </div>
      </div>
      <BottomBar />
    </>
  );
}
