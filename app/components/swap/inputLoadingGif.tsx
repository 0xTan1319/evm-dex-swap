import Image from "next/image";

export default function InputLoadingGif(props: any) {
  const { isLoading } = props;
  return (
    <div
      className={`${
        isLoading ? "flex" : "hidden"
      } absolute justify-center items-center top-1/2 left-2 -translate-y-1/2`}
    >
      <div className="relative aspect-square h-[30px]">
        <Image src="/img/swapping.gif" fill alt="" />
      </div>
    </div>
  );
}
