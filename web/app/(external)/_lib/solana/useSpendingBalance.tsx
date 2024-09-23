import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type BalanceContextType = {
  balance: number;
  setAddr: (addr: string) => void;
} | null;
const BalanceContext = createContext<BalanceContextType>(null);

export function SpendingBalanceProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [addr, setAddr] = useState<string>("");

  useEffect(() => {
    let subId: number | undefined;
    if (addr) {
      const account = new PublicKey(addr);
      subId = onReceiveInfo(account, connection, setBalance);
    }
    return () => {
      if (subId !== undefined) {
        connection.removeAccountChangeListener(subId);
      }
    };
  }, [addr, connection]);

  return (
    <BalanceContext.Provider value={{ balance, setAddr }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useSpendingBalance() {
  const ctx = useContext(BalanceContext);
  if (!ctx)
    throw new Error(
      "useSpendingBalance must be used within a SpendingBalanceProvider"
    );
  return Math.max(ctx.balance - 0.002, 0);
}

export function useSetSpendingAddr() {
  const ctx = useContext(BalanceContext);
  if (!ctx)
    throw new Error(
      "useSpendingBalance must be used within a SpendingBalanceProvider"
    );
  return ctx.setAddr;
}

function onReceiveInfo(
  account: PublicKey,
  connection: Connection,
  setBalance: (balance: number) => void
) {
  connection.getAccountInfo(account).then((info) => {
    if (info) setBalance(info.lamports / 1e9);
  });
  return connection.onAccountChange(account, (account) => {
    setBalance(account.lamports / 1e9);
  });
}
