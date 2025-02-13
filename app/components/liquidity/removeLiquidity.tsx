import { useState } from "react";
import ShowBalance from "../swap/showBalance";
import { BiRefresh } from "react-icons/bi";

export default function RemoveLiquidity(props: any) {
  const { amount, setAmount, Remove } = props;
  const [ balance, setBalance ] = useState(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: any = e.target.value;
    console.log("Add liquidity:::", value);
    setAmount(value);
  };

   const getBalance = async () => {
//   const abi = Abis[TOKEN_LIST[2].name];

//     const tokenBalance = await readContract(config, {
//         abi,
//         functionName: "balanceOf",
//         address: tokenAddress as Address,
//         args: [address as Address],
//       });
//     setBalance(balance);
  }

  return (
    <>
      <div className="flex">
        <ShowBalance balance={balance} />
        <BiRefresh
          onClick={getBalance}
          className="font-mono text-balance bg-black-1 mr-6 mt-[1px] z-10"
        />
      </div>
      <input
        onChange={handleAmountChange}
        value={amount ? amount : ""}
        className="bg-transparent border border-black-border px-4 disabled:cursor-not-allowed w-[80%] text-left outline-none sm:text-[24px] text-[20px] font-mono sm:h-[65px] h-[50px] text-white transition-colors"
        placeholder="0"
      />
      <button
        onClick={Remove}
        className="w-[100%] sm:h-[46px] h-[38px] text-gray-txt transition duration-500 bg-gray hover:bg-gray-bright"
      >
        <h1 className="font-mono text-white sm:text-[21px] text-[18px]">
          Remove Liquidity
        </h1>
      </button>
    </>
  );
}
