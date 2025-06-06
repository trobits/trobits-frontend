import { baseApi } from "./baseApi";

export interface AffiliateClickData {
  userId: string;
  affiliateId: string;
  affiliateName: string;
  affiliateUrl: string;
  userAgent: string;
  ipAddress?: string;
  referrer?: string;
  timestamp: Date;
  sessionId?: string;
}

export interface AffiliateClickResponse {
  success: boolean;
  data: {
    clickId: string;
    trackingUrl: string;
  };
}

export interface AffiliateAnalytics {
  totalClicks: number;
  uniqueUsers: number;
  topAffiliates: Array<{
    affiliateId: string;
    affiliateName: string;
    clicks: number;
    uniqueUsers: number;
  }>;
  clicksByDate: Array<{
    date: string;
    clicks: number;
  }>;
  userActivity: Array<{
    userId: string;
    userName: string;
    totalClicks: number;
    lastClick: Date;
    affiliatesClicked: string[];
  }>;
}

const affiliateApiEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Track affiliate link click
    trackAffiliateClick: build.mutation<AffiliateClickResponse, AffiliateClickData>({
      query: (clickData) => ({
        url: "/affiliate/track-click",
        method: "POST",
        body: clickData,
      }),
      invalidatesTags: ["affiliate-analytics"],
    }),

    // Get affiliate analytics for admin dashboard
    getAffiliateAnalytics: build.query<AffiliateAnalytics, { 
      startDate?: string; 
      endDate?: string; 
      affiliateId?: string;
    }>({
      query: ({ startDate, endDate, affiliateId }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (affiliateId) params.append("affiliateId", affiliateId);
        
        return {
          url: `/affiliate/analytics?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["affiliate-analytics"],
    }),

    // Get user's affiliate click history
    getUserAffiliateHistory: build.query<Array<{
      affiliateId: string;
      affiliateName: string;
      clickCount: number;
      lastClick: Date;
      totalEarnings?: number;
    }>, string>({
      query: (userId) => ({
        url: `/affiliate/user-history/${userId}`,
        method: "GET",
      }),
      providesTags: ["user-affiliate-history"],
    }),

    // Get top performing users for rewards
    getTopAffiliateUsers: build.query<Array<{
      userId: string;
      userName: string;
      email: string;
      totalClicks: number;
      uniqueAffiliates: number;
      estimatedEarnings: number;
      lastActivity: Date;
    }>, { limit?: number; period?: string }>({
      query: ({ limit = 50, period = "30d" }) => ({
        url: `/affiliate/top-users?limit=${limit}&period=${period}`,
        method: "GET",
      }),
      providesTags: ["top-affiliate-users"],
    }),

    // Update user rewards/earnings
    updateUserRewards: build.mutation<{ success: boolean }, {
      userId: string;
      amount: number;
      reason: string;
      affiliateId?: string;
    }>({
      query: (rewardData) => ({
        url: "/affiliate/update-rewards",
        method: "POST",
        body: rewardData,
      }),
      invalidatesTags: ["user-affiliate-history", "top-affiliate-users"],
    }),
  }),
});

export const {
  useTrackAffiliateClickMutation,
  useGetAffiliateAnalyticsQuery,
  useGetUserAffiliateHistoryQuery,
  useGetTopAffiliateUsersQuery,
  useUpdateUserRewardsMutation,
} = affiliateApiEndpoints; 