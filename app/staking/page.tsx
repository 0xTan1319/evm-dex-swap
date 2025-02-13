"use client";
import { useRouter } from "next/navigation";
import TopBar from "../components/swap/topBar";
import Image from "next/image";
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
      <div className="flex justify-center place-items-center mx-4">
        {/* <LoadingGif isLoading={isSwapping} /> */}

        <div className="flex flex-col w-full max-w-[563px]  bg-black-1 rounded-lg drop-shadow-xl mt-[20px] px-[22px] py-[16px]">
          <div className="flex">
            <div
              className="w-[50%] h-[33px] border rounded-l-lg border-black-border text-center items-center hover:cursor-pointer"
              onClick={() => {
                router.push("/swap");
              }}
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
            <div className="w-[50%] h-[33px] border rounded-r-lg border-black-border  bg-black-3 text-center items-center hover:cursor-pointer"
            >
              <h1 className="text-white mt-1">Vault</h1>
            </div>
          </div>
          <div className="flex justify-center items-center h-[300px] text-white">
            Coming Soon...
          </div>
        </div>
      </div>

      <BottomBar />
    </>
  );
}
