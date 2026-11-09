export const MONTHLY_TOKEN_LIMIT = 100_000;
export const MAX_RESPONSE_TOKENS = 1_024;

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

export const getTokenUsage = (user) => {
  const month = getCurrentMonth();
  const tokensUsed =
    user.tokenUsageMonth === month && Number.isFinite(user.tokensUsed)
      ? user.tokensUsed
      : 0;
  const [year, monthNumber] = month.split("-").map(Number);

  return {
    limit: MONTHLY_TOKEN_LIMIT,
    used: tokensUsed,
    remaining: Math.max(0, MONTHLY_TOKEN_LIMIT - tokensUsed),
    resetsAt: new Date(Date.UTC(year, monthNumber, 1)).toISOString(),
  };
};

export const recordTokenUsage = async (User, userId, tokensUsed) => {
  const month = getCurrentMonth();
  return User.findByIdAndUpdate(
    userId,
    [
      {
        $set: {
          tokenUsageMonth: month,
          tokensUsed: {
            $cond: [
              { $eq: ["$tokenUsageMonth", month] },
              { $add: [{ $ifNull: ["$tokensUsed", 0] }, tokensUsed] },
              tokensUsed,
            ],
          },
        },
      },
    ],
    { returnDocument: "after", updatePipeline: true },
  );
};
