import SlippageModal from "@/components/Modals/SlippageModal";
import TokenModal from "@/components/Modals/TokenModal";
import Navbar from "@/components/Navbar";
import Swap from "@/components/Swap/";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={`${inter.className} min-h-screen w-full text-black bg-white dark:bg-black dark:text-white justify-center items-center flex-col`}
    >
      <Navbar />
      <div className="flex w-full h-full mx-auto justify-center items-center px-3">
        <Swap />
        <TokenModal />
        <SlippageModal />
      </div>
    </div>
  );
}
