"use client";

import clsx from "clsx";
import { ComponentProps } from "react";
import { createPortal } from "react-dom";

export function Popup({
  className,
  onClose,
  ...props
}: ComponentProps<"div"> & { onClose: () => void }) {
  return createPortal(
    <div
      className="h-screen w-screen fixed top-0 left-0 grid place-items-center bg-black bg-opacity-65 z-50 overflow-auto"
      onClick={onClose}
    >
      <div className="p-4 max-w-lg w-full">
        <div
          className={clsx("bg-white rounded-lg", className)}
          {...props}
          onClick={(...args) => {
            args[0].stopPropagation();
            props.onClick?.(...args);
          }}
        />
      </div>
    </div>,
    document.body
  );
}
