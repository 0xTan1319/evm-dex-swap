// components/Modal.tsx
"use client";

import React, { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setSlippagePercent: any;
  //   children: React.ReactNode;
}

const SetSlippageModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  setSlippagePercent,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState("");

  // Retrieve the slippage amount from local storage
  // const savedSlippage = window.localStorage.getItem('slippageAmount');

  // Convert it back to a number
  // const slippageAmount : any = savedSlippage ? parseFloat(savedSlippage) : null;

  // setAmount(slippageAmount);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const savedValue: any = window.localStorage.getItem("slippage");
    setAmount(savedValue);
  }, []);

  useEffect(() => {
    // if (typeof amount === "number") {
    console.log("slippage Amount==", amount);

    if (amount != "") window.localStorage.setItem("slippage", amount);
    // }
  }, [amount]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // setAmount(slippageAmount)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val: any = e.target.value;
    console.log("val", val);
    setAmount(val);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div
        ref={modalRef}
        className="bg-modal rounded-2xl shadow-lg w-7/12 max-w-md"
      >
        <div className="flex justify-between bg-modal-title rounded-t-2xl items-center px-4 py-3">
          <h2 className="sm:text-[19px] text-[16px] text-white/90 font-semi">
            {title}
          </h2>
          <RiCloseLargeFill
            onClick={onClose}
            className="text-white text-[20px] hover:text-[21px] cursor-pointer rounded-md transition duration-300"
          />
        </div>

        <div className="flex justify-between sm:flex-row flex-col place-items-center px-3">
          <div className="sm:h-[35px] h-[34px] sm:w-[85px] w-[100%] my-4 px-4 border border-black-border rounded-lg items-center">
            <input
              onChange={handleAmountChange}
              value={amount}
              className="numberInput bg-transparent w-[100%] text-left outline-none sm:text-[17px] text-[15px] font-mono sm:h-[35px] h-[34px] text-white transition-colors"
              placeholder="0.00%"
              type="number"
            />
          </div>
          <div className="flex justify-center sm:w-auto w-[90%]">
            <div
              onClick={() => setAmount("0.5")}
              className="sm:w-[65px] w-[30%] sm:h-[35px] h-[34px] border rounded-l-lg border-black-border  text-center items-center hover:bg-gray-bright hover:cursor-pointer"
            >
              <h1 className="text-white mt-1 sm:text-[17px] text-[14px]">
                0.5%
              </h1>
            </div>
            <div
              onClick={() => setAmount("1")}
              className="sm:w-[65px] w-[30%]  sm:h-[35px] h-[34px] border border-black-border  text-center items-center hover:bg-gray-bright hover:cursor-pointer"
            >
              <h1 className="text-white mt-1 sm:text-[17px] text-[14px]">1%</h1>
            </div>
            <div
              onClick={() => setAmount("3")}
              className="sm:w-[65px] w-[30%]  sm:h-[35px] h-[34px] border rounded-r-lg border-black-border  text-center items-center hover:bg-gray-bright hover:cursor-pointer"
            >
              <h1 className="text-white mt-1 sm:text-[17px] text-[14px]">3%</h1>
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-4 sm:mt-0 mt-5 px-3">
          <button
            onClick={() => {
              if (amount == "") {
                toast.warning("Input correctly!");
                return;
              }
              setSlippagePercent(amount);
              // window.localStorage.setItem('slippageAmount', amount.toString());
              onClose();
            }}
            className="w-[100%] sm:h-[38px] h-[35px] text-gray-txt rounded-lg transition duration-300 border border-gray hover:bg-gray-bright"
          >
            <h1 className="font-mono text-white sm:text-[19px] text-[17px]">
              Save setting
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetSlippageModal;
