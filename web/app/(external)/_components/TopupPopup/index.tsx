"use client";

import { Button } from "@/app/(external)/_components/Button";
import { Popup } from "@/app/(external)/_components/Popup";
import { useState } from "react";

type TopupPopupProps = {
  title?: string;
  message?: string;
  onClose: () => void;
  /** It doesn't automatically close the popup. */
  onConfirm: (amount: number) => void;
  disabled?: boolean;
  btn?: string;
  min?: number;
};

/** It doesn't create a topup instruction nor a transaction. Use it as a prompt. */
export function TopupPopup(props: TopupPopupProps) {
  const [amount, setAmount] = useState(props.min?.toString() || "1");

  return (
    <Popup
      className="px-5 py-4 flex flex-col gap-6"
      onClose={() => {
        !props.disabled && props.onClose();
      }}
    >
      <div>
        <div className="text-2xl font-semibold text-center">
          {props.title || "Topup"}
        </div>
        <div className="flex mb-3">
          <div className="border-b-2 border-[#A58BCF] flex-1"></div>
          <div className="border-b-2 border-[#35D3DE] flex-1"></div>
        </div>
        <p>{props.message}</p>
      </div>
      <div className="flex gap-2 items-center border-2 rounded-md border-gray-300 px-2 py-1 text-lg">
        <div className="flex-1">
          <input
            type="number"
            className="w-full outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={props.disabled}
            min={props.min}
          />
        </div>
        <span className="flex-grow-0">SOL</span>
      </div>
      <div className="mb-4">
        <Button
          className="text-white w-full py-1.5 text-xl font-semibold max-w-44 block mx-auto"
          disabled={
            isNaN(Number(amount)) ||
            Number(amount) === 0 ||
            props.disabled ||
            !!(props.min && Number(amount) < props.min)
          }
          onClick={() => props.onConfirm(Number(amount))}
        >
          {props.btn || "Confirm"}
        </Button>
      </div>
    </Popup>
  );
}
