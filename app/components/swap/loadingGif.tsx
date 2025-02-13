import Image from "next/image";

export default function LoadingGif(props: any) {
  const { isLoading } = props;
  return (
    <div
      className={`bg-black-1/30 fixed w-full h-full z-50 ${
        isLoading ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-center items-center w-full h-full">
        <div className="relative aspect-square w-[80px]">
          <Image src="/img/swapping.gif" fill alt="" />
        </div>
      </div>
    </div>
  );
}
