"use client";

import getCurrentUser from "@/app/(external)/_actions/users/getCurrentUser";
import getUserSpendingAccount from "@/app/(external)/_actions/users/getUserSpendingAccount";
import { setCurrentUser } from "@/app/(external)/_actions/users/setCurrentUser";
import React, { FormEventHandler, useState } from "react";

export function Demo() {
  const [uuid, setUuid] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [spending, setSpending] = useState("");

  const handleLogin: FormEventHandler = (e) => {
    // you should not call it from client, it is only for demo
    e.preventDefault();
    setCurrentUser(uuid);
  };

  const getUserInfo = () => {
    getCurrentUser().then((user) => {
      if (!user) {
        setUserInfo("User not found");
      } else {
        setUserInfo(`User found: ${JSON.stringify(user)}`);
      }
    });
  };

  const getSpending = () => {
    getUserSpendingAccount(uuid).then((pubkey) => {
      setSpending(`Spending account: ${pubkey}`);
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <form onSubmit={handleLogin} className="flex space-x-2">
        <input
          type="text"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          placeholder="Uuid"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Set User
        </button>
      </form>

      <div className="space-y-4">
        <div>
          <form className="flex space-x-2">
            <button
              type="button"
              onClick={getUserInfo}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Get User Info
            </button>
            <div className="flex-grow p-2 border border-gray-300 rounded-md">
              {userInfo}
            </div>
          </form>
        </div>

        <div>
          <form className="flex space-x-2">
            <button
              type="button"
              onClick={getSpending}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Get Spending
            </button>
            <div className="flex-grow p-2 border border-gray-300 rounded-md">
              {spending}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
