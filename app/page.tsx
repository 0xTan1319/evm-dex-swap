'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

function Page() {
  const router = useRouter();

  useEffect(()=>{
    router.push("/swap")
  },[])

  return (
    <div className="flex w-full h-full justify-center items-center">
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default Page;
