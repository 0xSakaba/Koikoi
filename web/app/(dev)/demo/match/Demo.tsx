"use client";

import { getMatches } from "@/app/(external)/_actions/matches/getMatches";
import { Match } from "@prisma/client";
import { useEffect, useState } from "react";

export function Demo() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    getMatches().then((data) => {
      setMatches(data);
    });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Match</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{match.id}</td>
                <td className="py-2 px-4 border-b">
                  {match.date.toDateString()}
                </td>
                <td className="py-2 px-4 border-b">{match.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
