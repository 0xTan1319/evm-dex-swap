import { IoIosSettings } from "react-icons/io";
import { useState } from "react";
import SetSlippageModal from "./setSlippageModal";

export default function SetSlippageButton(props: any) {
  const { setSlippagePercent } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <IoIosSettings
        onClick={openModal}
        className="transition duration-500 text-[33px] text-white hover:text-white/50 cursor-pointer"
      />
      <SetSlippageModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Slippage Settings"
            setSlippagePercent={setSlippagePercent}
          />
    </>
  );
}
