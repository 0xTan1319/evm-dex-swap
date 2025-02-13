import { useEffect } from "react";

const showPercent = (
  baseAmount: any,
  quoteAmount: any,
  isCreatedPair: any,
  fixedVal: any
) => {
  if (fixedVal > 0) return fixedVal;
  if (
    (
      baseAmount === "" ||
      quoteAmount === "" ||
      baseAmount === 0 ||
      quoteAmount === 0
    ) && !isCreatedPair
  )
    return `---`;
  // if (isCreatedPair > 0) {
  //   console.log("iscreated pair is bigger");
  //   const amtOut = getAmountsOut(baseToken, quoteToken);
  //   return amtOut;
  // }
  // const resOut: any = await getAmountsOutFromDEX(quoteToken, baseToken, 1);
  // console.log("TTTTTTTTTTTT", resOut.result);
  if (
    baseAmount == "" ||
    baseAmount == 0 ||
    quoteAmount == "" ||
    quoteAmount == 0
  )
    return 0;
  const res: any = (quoteAmount / baseAmount).toFixed(4);
  if(isNaN(res)) return 0;
  return res;
};

const showTokenName = (token: any) => {
  if (token === -1) return;
  return `${token.symbol}`;
};

export default function ShowPercent(props: any) {
  const {
    baseToken,
    baseAmount,
    quoteToken,
    quoteAmount,
    isCreatedPair,
    fixedVal,
  } = props;

  useEffect(() => {
    showPercent(baseAmount, quoteAmount, isCreatedPair, fixedVal);
  }, [isCreatedPair]);

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-white text-[17px]">
          {showPercent(baseAmount, quoteAmount, isCreatedPair, fixedVal)}
        </h1>
        <h1 className="text-white text-[16px]">
          {showTokenName(quoteToken)}
          {<> / </>}
          {showTokenName(baseToken)}
        </h1>
      </div>
    </>
  );
}
