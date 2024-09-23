import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserInfo } from "../_actions/users/getUserInfo";
import { usePrivy } from "@privy-io/react-auth";
import { useConnection } from "@solana/wallet-adapter-react";
import { useSetSpendingAddr } from "./solana/useSpendingBalance";

const UserInfoContext = createContext<Awaited<
  ReturnType<typeof getUserInfo>
> | null>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { authenticated, getAccessToken } = usePrivy();
  const [userInfo, setUserInfo] = useState<Awaited<
    ReturnType<typeof getUserInfo>
  > | null>(null);
  const setAddr = useSetSpendingAddr();

  useEffect(() => {
    if (authenticated) {
      getAccessToken()
        .then(getUserInfo)
        .then((info) => {
          setUserInfo(info);
          if (info) {
            setAddr(info.spendingAccount);
          }
        });
    }
  }, [authenticated, getAccessToken, setAddr]);

  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  return useContext(UserInfoContext);
}
