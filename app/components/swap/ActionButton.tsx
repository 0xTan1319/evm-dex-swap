"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSwitchChain, useChainId } from "wagmi";
import { cronos } from "viem/chains";
import Image from "next/image";

export default function ConnectWalletButton({
  callback,
  text,
}: {
  callback: (() => Promise<void>) | undefined;
  text?: string;
}) {
  const { chains, switchChain, error } = useSwitchChain();
  const chainId = useChainId();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        const switchChainHandle = async () => {
          switchChain({ chainId: cronos.id });
        };

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="w-[100%] sm:h-[46px] h-[38px] transition duration-500 bg-purple hover:bg-purple-bright"
                  >
                    <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                      Connect Wallet
                    </h1>
                  </button>
                );
              }
              if (chainId != cronos.id) {
                return (
                  <button
                    onClick={switchChainHandle}
                    className="w-[100%] sm:h-[46px] h-[38px]  transition duration-500 bg-purple hover:bg-purple-bright"
                  >
                    <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                      Switch network
                    </h1>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="w-full py-3 bg-green-600  mt-4 text-xl rounded-xl hover:shadow-button hover:shadow-blue-400 hover:text-blue-400 text-orange-700 uppercase tracking-widest"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <button
                  onClick={() =>{
                    if(callback != undefined) return callback();
                  }}
                  disabled={!callback}
                  className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-purple hover:bg-purple-bright"
                >
                  <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
                    {text}
                  </h1>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
