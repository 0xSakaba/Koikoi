"use client";

import clsx from "clsx";
import { ComponentProps } from "react";

export function Popup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 grid place-items-center bg-black bg-opacity-65 z-50 overflow-auto">
      <div className="p-4 max-w-lg w-full">
        <div className={clsx("bg-white rounded-lg", className)} {...props} />
      </div>
    </div>
  );
}
