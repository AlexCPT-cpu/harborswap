"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setInput("");
      }}
      className="flex flex-row space-x-4 border border-black dark:border-neutral-600 p-2 rounded-2xl lg:w-80"
    >
      <MagnifyingGlassIcon className="w-6 text-black dark:text-neutral-700" />
      <input
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder="Search Tokens"
        className="bg-transparent text-black dark:text-white placeholder:pl-12 placeholder:text-black placeholder:dark:text-neutral-700 border-none outline-none w-full"
      />
      <button type="submit" className="hidden" />
    </form>
  );
};

export default SearchBar;
