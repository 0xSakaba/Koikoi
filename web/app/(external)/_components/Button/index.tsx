import clsx from "clsx";
import { ComponentProps } from "react";

export function Button({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={clsx(
        className,
        "bg-gradient-to-b from-solana-light to-solana-dark rounded-xl"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
