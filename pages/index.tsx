import Image from "next/image";
import { Inter } from "next/font/google";
import ConnectButton from "@/components/ConnectButton";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="min-h-screen w-full text-black bg-white dark:bg-black dark:text-white">
      <Navbar />
      {/* <Image src="/image.png" alt="" width={500} height={500} /> */}
    </main>
  );
}
