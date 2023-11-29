import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Swap from "@/components/Swap/";
import TokenModal from "@/components/Modals/TokenModal";
import { useEffect } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useEffect(() => {
    const test = async () => {
      const data = await axios.get("/api/test");
      console.log(data);
    };
    // test();
    // setTimeout(() => test(), 1000);
  }, []);
  return (
    <main
      className={`${inter.className} min-h-screen px-3 w-full text-black bg-white dark:bg-black dark:text-white justify-center items-center flex-col`}
    >
      <Navbar />
      <div className="flex w-full justify-center items-center">
        <Swap />
        <TokenModal />
      </div>
    </main>
  );
}
