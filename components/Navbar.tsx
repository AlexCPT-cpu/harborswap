"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { ThemeToggle } from "./ThemeToogle";
import ConnectButton from "./ConnectButton";
import Tabs from "./Tabs";

const Navbar = () => {
  const [active, setActive] = useState<string>("swap");
  return (
    <div className="flex flex-row justify-between pt-3 items-center">
      <Tabs active={active} setActive={setActive} />

      <div className="pl-8">
        <SearchBar />
      </div>
      <div className="flex flex-row items-center space-x-4">
        <div>
          <ConnectButton />
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
