import Image from "next/image";

export default function BottomBar() {
  return (
    <>
      <div className="flex md:flex-row flex-col items-center gap-6 justify-center">

        <div
          className="md:absolute bottom-0 right-0 w-auto h-[60px] m-6"
          style={{ aspectRatio: "708 / 234" }}
        >
          <img
            src={`/img/cronosproject.webp`}
            alt="Image"
            className="md:right-0 object-contain w-full h-full"
          />
        </div>
      </div>
    </>
  );
}
