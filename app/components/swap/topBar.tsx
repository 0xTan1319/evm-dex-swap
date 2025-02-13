import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io5";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoMdHelpCircle } from "react-icons/io";
import { VscGitStashApply } from "react-icons/vsc";

export default function TopBar() {

  return (
    <div className="w-full flex md:flex-row flex-col items-center justify-between md:py-0 py-10 md:h-[170px] h-auto from-transparent from-transparent p-[9px]">
      <div className="">
 
      </div>
      <div className="flex gap-6 mt-10 min-[1280px]:flex-row flex-col md:justify-items-end md:mr-12 mr-0 hover:cursor-pointer">


        <ConnectButton />
      </div>
    </div>
  );
}
