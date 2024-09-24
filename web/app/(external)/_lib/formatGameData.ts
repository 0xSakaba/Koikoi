type GameBetInfo = {
  leftTeam: BetInfo;
  rightTeam: BetInfo;
  draw: BetInfo;
  pool: number;
};

type BetInfo = {
  bettors: number;
  pool: number;
  prize: number;
};

type GameResult = {
  options: number;
  pool: string;
  bettors: string[][];
  betAmounts: string[][];
};

// @note: the number is presented in the format of hex string
export function formatGameResult(data: GameResult): GameBetInfo {
  const gamePool = parseInt(data.pool, 16) / 1e9;
  const leftTeamPool =
    data.betAmounts[0].reduce((a, b) => a + parseInt(b, 16), 0) / 1e9;
  const leftTeamPrize =
    data.betAmounts[0].length > 0 ? gamePool / data.betAmounts[0].length : 0;
  const rightTeamPool =
    data.betAmounts[1].reduce((a, b) => a + parseInt(b, 16), 0) / 1e9;
  const rightTeamPrize =
    data.betAmounts[1].length > 0 ? gamePool / data.betAmounts[1].length : 0;
  const drawPool =
    data.betAmounts[2].reduce((a, b) => a + parseInt(b, 16), 0) / 1e9;
  const drawPrize =
    data.betAmounts[2].length > 0 ? gamePool / data.betAmounts[2].length : 0;
  return {
    pool: gamePool,
    leftTeam: {
      bettors: data.betAmounts[0].length,
      pool: leftTeamPool,
      prize: leftTeamPrize,
    },
    rightTeam: {
      bettors: data.betAmounts[1].length,
      pool: rightTeamPool,
      prize: rightTeamPrize,
    },
    draw: {
      bettors: data.betAmounts[2].length,
      pool: drawPool,
      prize: drawPrize,
    },
  };
}
