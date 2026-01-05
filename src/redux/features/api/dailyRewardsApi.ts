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
    getDailyRewardsStatus: build.query<DailyRewardsStatusData, void>({
      query: () => ({
        url: "/daily-rewards/status",
        method: "GET",
      }),
      transformResponse: (response: ApiEnvelope<DailyRewardsStatusData>) => response.data,
      providesTags: ["user"],
    }),

    claimDailyReward: build.mutation<ClaimResponseData, void>({
      query: () => ({
        url: "/daily-rewards/claim",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<ClaimResponseData>) => response.data,
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetDailyRewardsStatusQuery,
  useClaimDailyRewardMutation,
} = dailyRewardsApi;
