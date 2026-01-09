/* eslint-disable @typescript-eslint/no-unused-vars */
import { baseApi } from "./baseApi";

type DailyRewardsStatusData = {
  pointsBalance: number;
  cycleKey: string;
  canClaim: boolean;
  alreadyClaimed: boolean;
  streakDayToClaim: number; // day number that is claimable now (1..7)
  pointsIfClaimNow: number;
  lastClaimAt: string | null;
  lastCycleKey: string | null;
  nextResetAtUtc: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ClaimResponseData = {
  awarded: {
    cycleKey: string;
    dayNumber: number;
    points: number;
    claimedAt: string;
  };
  pointsBalance: number;
  nextDayToClaim: number;
};

const dailyRewardsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ userId used only as cache key; backend still uses token for identity.
    getDailyRewardsStatus: build.query<DailyRewardsStatusData, string>({
      query: () => ({
        url: "/daily-rewards/status",
        method: "GET",
      }),
      transformResponse: (response: ApiEnvelope<DailyRewardsStatusData>) =>
        response.data,

      // ✅ IMPORTANT: refetch when component mounts (e.g., navigating to /daily-rewards)
      refetchOnMountOrArgChange: true,

      // optional: reduce stale cache window
      keepUnusedDataFor: 10,

      providesTags: (_result, _error, userId) => [{ type: "user", id: userId }],
    }),

    claimDailyReward: build.mutation<ClaimResponseData, string>({
      query: () => ({
        url: "/daily-rewards/claim",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<ClaimResponseData>) =>
        response.data,

      invalidatesTags: (_result, _error, userId) => [{ type: "user", id: userId }],
    }),
  }),
});

export const {
  useGetDailyRewardsStatusQuery,
  useClaimDailyRewardMutation,
} = dailyRewardsApi;
