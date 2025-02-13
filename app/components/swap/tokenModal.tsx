// components/Modal.tsx
"use client";

import React, { useCallback, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTokenBalances } from "@/app/hooks/useTokenBalances";
import { optopia } from "wagmi/chains";
import { ZeroAddress } from "ethers";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  opToken: any;
  otherToken: any;
  setToken: any;
  //   children: React.ReactNode;
}

const TokenModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  opToken,
  otherToken,
  setToken,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [searchStr, setSearchStr] = useState("");
  const { tokens, isLoading } = useTokenBalances();
  const [filteredTokens, setFilteredTokens] = useState<any[] | undefined>(undefined);

  const filterTokens = useCallback(() => {
    if(tokens == undefined) return;
    console.log("🚀 ~ filterTokens ~ tokens:", tokens)
    
    const filtered = tokens?.filter((token) => {
      return (
        (strstr(token.symbol, searchStr) ||
          strstr(token.symbol, searchStr) ||
          strstr(token.address, searchStr)) &&
          (otherToken.address.toLowerCase() != token.address.toLowerCase()) &&
        (opToken.address.toLowerCase() != token.address.toLowerCase())
        // true
      );
    });
    setFilteredTokens(filtered);
  }, [searchStr, tokens, otherToken, opToken]);

  useEffect(() => {
      filterTokens();
  }, [searchStr, tokens, isLoading, otherToken, opToken])

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val: any = e.target.value;
    setSearchStr(val);
  };

  function strstr(string1: string, string2: string): boolean {
    return string1.toLowerCase().includes(string2.toLowerCase());
  }

  const abbreviateAddress = (address: any) => {
    if (address == "" || address == ZeroAddress) return ``;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-modal rounded-lg shadow-lg w-[563px] transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="sm:text-[20px] text-[17px] text-white/90 font-semibold">
            {title}
          </h2>
          <RiCloseLargeFill
            onClick={onClose}
            className="text-white text-[20px] hover:text-[21px] cursor-pointer rounded-md transition duration-300"
          />
        </div>
        <div className="sm:h-[42px] h-[36px] my-4 mx-4 px-4 border border-black-border rounded-full items-center">
          <input
            onChange={handleSearch}
            value={searchStr}
            className="bg-transparent w-[100%] text-left outline-none sm:text-[17px] text-[15px] font-mono sm:h-[38px] h-[34px] text-white transition-colors"
            placeholder="Search here ..."
          />
        </div>
        <div className="flex flex-col mt-5 mb-8 h-[396px] overflow-y-auto">
          {filteredTokens?.length == 0 ? (
            <div className="flex justify-center mt-3">
              <h1 className="text-white/50 sm:text-[16px] text-[15px] font-semibold">
                No results found.
              </h1>
            </div>
          ) : (
            filteredTokens?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex place-items-center hover:bg-white/10 px-4 py-2"
                >
                  <div className="flex justify-center place-items-center relative w-7 h-6 ">
                    <Image
                      className="rounded-full"
                      src={`/img/token_icons/${item.symbol}.png`}
                      fill
                      alt=""
                    />
                  </div>
                  <div
                    onClick={() => {
                      setToken(item);
                      onClose();
                    }}
                    className="group flex flex-col w-full gap-2 rounded-lg  pl-3 data-[focus]:bg-white/10 hover:cursor-pointer"
                  >
                    {/* <div className="flex flex-col"> */}
                    <div className="flex justify-between w-full">
                      <h1 className="text-white font-mono sm:text-[17px] text-[15px]">
                        {item.symbol}
                      </h1>
                      <h1 className="text-white/50 font-mono sm:text-[17px] text-[15px]">
                        {item.balance}
                      </h1>
                    </div>
                    <div className="flex gap-5">
                      <h1 className="text-white/50 font-mono sm:text-[15px] text-[13px]">
                        {item.name}
                      </h1>
                      <h1 className="text-white/50 font-mono sm:text-[15px] text-[13px]">
                        {abbreviateAddress(item.address)}
                      </h1>
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
