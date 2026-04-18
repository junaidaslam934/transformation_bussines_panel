"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
const AuthBackground = () => {
  return (
    <div
      className={cn(
        "fixed w-[45%] hidden lg:flex justify-center items-center overflow-hidden h-screen bg-primary"
      )}
    >
      <Image
        src={'/assets/logo/black-logo.png'}
        alt="Logo"
        className="select-none pointer-events-none"
        width={500}
        height={500}
        style={{
          width: "auto",
          height: "auto",
        }}
        quality={100}
        priority
        // placeholder="blur"
        // blurDataURL={IMAGES.blurDataURL}
        loading="eager"
      />
    </div>
  );
};
export default AuthBackground;