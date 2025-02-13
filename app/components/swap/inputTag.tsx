"use client";

import { useEffect, useState } from "react";
import ShowBalance from "./showBalance";
import TokenModal from "./tokenModal";
import InputLoadingGif from "./inputLoadingGif";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";

export default function InputTag(props: any) {
  const {
    balance,
    amount,
    setAmount,
    token,
    opToken,
    setToken,
    no,
    isAmountCalcing,
    setIsInsufficient,
    USDprice,
    showMAXbtn,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    let bal = token.isNative ? balance - 5 : balance;
    if (amount > Number(bal) && !no)
      setIsInsufficient(true); //check input amount is valid
    else setIsInsufficient(false);
  }, [amount]);

  const handleAmountChange = (e: any) => {
    const value: number = e.target.value as number;
    setAmount(value);
  };

  return (
    <>
      <div className="grid justify-items-end mt-5">
        <div className="flex">
          <ShowBalance balance={balance} />
        </div>
      </div>
      <div
        className={`flex relative justify-between w-[100%] sm:h-[66px] h-[50px] border border-black-border px-[15px] -mt-[11px]`}
      >
        <InputLoadingGif isLoading={isAmountCalcing} />

        <input
          onChange={handleAmountChange}
          value={
            amount
              ? amount == 0
                ? 0
                : Math.floor(Number(amount) * 1000) / 1000
              : ""
          }
          disabled={no}
          type="number"
          className={`${
            isAmountCalcing ? "text-[#666]" : "text-white"
          } numberInput bg-transparent disabled:cursor-not-allowed w-[60%] text-left outline-none sm:text-[24px] text-[20px] font-mono sm:h-[65px] h-[50px] transition-colors`}
          placeholder="0"
        />
        <div className="flex justify-items-end items-center">
          {USDprice == 0 ? (
            <></>
          ) : (
            <h1 className="text-right font-mono text-balance text-sm">
              ${Number(USDprice).toFixed(3)}
            </h1>
          )}
        </div>
        {showMAXbtn ? (
          <div
            onClick={() => {
              if (token.isNative) setAmount(balance - 5);
              else setAmount(balance);
            }}
            className="flex justify-items-end items-center pl-3 hover:cursor-pointer"
          >
            <h1 className="text-right font-mono text-white hover:text-balance transition-3 text-[18px]">
              MAX
            </h1>
          </div>
        ) : (
          <></>
        )}
        <div className="flex items-center justify-center bg-gray-100">
          <button
            onClick={openModal}
            className="w-full inline-flex items-center gap-2 py-1.5 px-3 sm:text-[18px] text-[15px] font-semi text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-none"
          >
            <div className="flex gap-3 place-items-center">
              <div className="flex justify-center place-items-center relative w-5 h-5 ">
                <Image
                  className="rounded-full"
                  src={`/img/token_icons/${token.symbol}.png`}
                  fill
                  alt=""
                />
              </div>
              {token.symbol}
            </div>
            <MdOutlineKeyboardArrowDown className="text-[27px] font-bold" />
          </button>
          <TokenModal
            isOpen={isModalOpen}
            onClose={closeModal}
            opToken={opToken}
            title="Select a token"
            otherToken={token}
            setToken={setToken}
          />
        </div>
      </div>
    </>
  );
}
