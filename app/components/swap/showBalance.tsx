export default function ShowBalance(props: any) {
  const { balance } = props;
  // const showBalance = !isNaN(Number(balance?.formatted)) ? Number(balance?.formatted).toFixed(3) : '0';
  const showBalance = !isNaN(Number(balance)) ? Number(balance).toFixed(3) : '0';
  return (
    <h1 className="font-mono text-balance text-sm z-10 bg-black-1 ml-6 px-2 mr-4">
      Balance: {showBalance}
    </h1>
  );
}
