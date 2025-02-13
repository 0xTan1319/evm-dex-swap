"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import TopBar from "../components/swap/topBar";
import { FiDownload } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import BottomBar from "../components/bottomBar";

export default function Home() {
  const router = useRouter();

  return (
    <>
        <TopBar />
        <div className="flex justify-center mt-[50px] mx-16">
          <h1 className="text-white text-center sm:text-[30px] text-[23px] animate-pulse">
            Swap your tokens or provide liquidity!
          </h1>
        </div>
        <div className="flex justify-center place-items-center mx-2 ">
          <div className="flex flex-col w-full max-w-[563px]   bg-black-1 rounded-lg drop-shadow-xl mt-[20px] px-[22px] py-[16px]">
            <div className="flex">
              <div
                onClick={() => {
                  router.push("/swap");
                }}
                className="w-[50%] h-[33px] border rounded-l-lg border-black-border text-center items-center hover:cursor-pointer"
              >
                <h1 className="text-white mt-1">Swap</h1>
              </div>
              <div className="w-[50%] h-[33px] border border-black-border text-center bg-black-3 items-center hover:cursor-pointer">
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


                <div className="flex sm:flex-row flex-col items-center gap-4 justify-between px-10 py-5">
                  <div
                    onClick={() => {
                      router.push("/liquidity/import");
                    }}
                    className="flex items-center text-[17px] hover:cursor-pointer hover:underline"
                  >
                    <FiDownload className="text-white" />
                    <h1 className="text-white font-mono mx-1">View pool</h1>
                  </div>
                  <div
                    onClick={() => {
                      router.push("/liquidity/add");
                    }}
                    className="flex items-center text-[17px] hover:cursor-pointer hover:underline"
                  >
                    <IoMdAdd className="text-white" />
                    <h1 className="text-white font-mono mx-1">Add liquidity</h1>
                  </div>
                </div>
                <div className="flex flex-col text-center grid gap-8 justify-center py-10 px-5 border border-black-border rounded-lg">
                  <h1 className="text-white font-mono">
                    Import pool to see your liquidity or remove liquidity.
                  </h1>
                  <h1 className="text-white font-mono">
                    Add liquidity to add your liquidity from tokens.
                  </h1>
                </div>
        
            
          </div>
        </div>
        <BottomBar />
    </>
  );
}
