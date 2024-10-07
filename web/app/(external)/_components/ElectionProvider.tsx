"use client";

import { createContext, ReactNode, useContext } from "react";

const ElectionContext = createContext<boolean>(false);

export function ElectionProvider({
  isElection,
  children,
}: {
  isElection: boolean;
  children: ReactNode;
}) {
  return (
    <ElectionContext.Provider value={isElection}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  return useContext(ElectionContext);
}
