"use client";

import { formatGwei, parseEther, parseGwei } from "viem";
import { formatEther } from "viem";

export default function YourLockedValue(props: any) {
  const { value } = props;

  return (
    <div className="flex flex-row gap-2 place-items-center px-5 w-[100%]">
      <div className="flex flex-col justify-center place-items-center">
        <h1 className="text-white font-mono sm:text-[18px] text-[15px]">Staked amount : </h1>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-white font-mono sm:text-[18px] text-[15px]">
          {value !== undefined
            ? parseFloat(formatEther(value)).toFixed(2)
            : "..."}
        </h1>
      </div>
    </div>
  );
}
