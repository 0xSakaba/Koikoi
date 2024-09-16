import clsx from "clsx";
import { ComponentProps } from "react";
import { match } from "ts-pattern";

type Variant = "primary" | "secondary";
function getVariant(variant: Variant) {
  return match(variant)
    .with("primary", () => "bg-gradient-to-b from-solana-light to-solana-dark")
    .with("secondary", () => "border border-gray-200")
    .exhaustive();
}

export function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      className={clsx(className, getVariant(variant), "rounded-xl")}
      {...props}
    >
      {children}
    </button>
  );
}
