"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { ThemeToggle } from "./ThemeToogle";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import ConnectButton from "./ConnectButton";

const Navbar = () => {
  const [active, setActive] = useState<string>("swap");
  return (
    <div className="flex flex-row justify-between px-10 pt-3 items-center">
      <div className="flex flex-row space-x-4 items-center">
        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "swap"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          onClick={() => setActive("swap")}
        >
          Swap
        </div>
        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "tokens"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          onClick={() => setActive("tokens")}
        >
          Tokens
        </div>
        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "launchpad"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          onClick={() => setActive("launchpad")}
        >
          Launchpad
        </div>

        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "launchpad"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          //onClick={() => setActive("launchpad")}
        >
          <EllipsisHorizontalIcon className="w-8" />
        </div>
      </div>

      <div>
        <SearchBar />
      </div>
      <div className="flex flex-row items-center">
        <div>chain</div>
        <div>
          <ConnectButton />
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
