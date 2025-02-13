"use client";

import { formatGwei, parseEther, parseGwei } from "viem";
import { formatEther } from "viem";

export default function TotalLockedValue(props: any) {
  const { value } = props;

  return (
    <div className="flex flex-col items-center justify-center w-[100%]">
      <div className="flex flex-col justify-center px-2 pt-3">
        <h1 className="text-white sm:text-[23px] text-[20px]">Total Staked</h1>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-white sm:text-[38px] text-[33px] pt-2">
          {value !== undefined
            ? parseFloat(formatEther(value)).toFixed(2)
            : "Loading..."}
        </h1>
      </div>
    </div>
  );
}
