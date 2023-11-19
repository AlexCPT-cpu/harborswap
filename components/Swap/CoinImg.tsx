import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useMemo, useState } from "react";

const CoinImg = ({
  width,
  height,
  src,
  ring,
  name,
}: {
  width: number;
  height: number;
  src: string;
  name?: string;
  ring?: boolean;
}) => {
  const image = useMemo(() => {
    const x = src;
    if (src.startsWith("ipfs://")) {
      x.replace("ipfs://", "https://ipfs.io/ipfs/");
      return x;
    } else return src;
  }, [src]);
  const [error, setError] = useState<boolean>(false);

  return (
    <>
      {error ? (
        <div className="ring-1 ring-black dark:ring-white w-10 h-10 rounded-full justify-center items-center pt-2 mx-auto text-center">
          ?
        </div>
      ) : (
        <Image
          className={`rounded-full ${
            ring ? "ring-1 ring-black dark:ring-white/20" : ""
          }`}
          width={width}
          height={height}
          alt="cointImg"
          src={image}
          onError={() => setError(true)}
        />
      )}
    </>
  );
};

export default CoinImg;
