"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({
  input,
  setInput,
}: {
  input: string;
  setInput: (contract: string) => void;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setInput("");
      }}
      className="flex flex-row space-x-4 border border-black dark:border-neutral-600 p-2 rounded-xl w-full hover:border-yellow-300/70 dark:hover:border-yellow-300/70 cursor-pointer"
    >
      <MagnifyingGlassIcon className="w-6 text-black dark:text-neutral-700" />
      <input
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder="Search Name or Paste Address"
        className="bg-transparent text-black dark:text-white placeholder:text-black placeholder:dark:text-neutral-700 border-none outline-none w-full"
      />
      <button type="submit" className="hidden" />
    </form>
  );
};

export default SearchBar;
