/* eslint-disable @typescript-eslint/no-unused-vars */

import { RootState } from "@/redux/store";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { clearUser, setUser } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1",
  // baseUrl: "https://sisiku-backend.vercel.app/api/v1",
  //baseUrl: "https://api.trobits.com/api/v1",
   baseUrl: "https://gkhw99d6-3000.inc1.devtunnels.ms/api/v1",
  // baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/access-token`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            refreshToken: localStorage.getItem("refreshToken"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      // ✅ Normalize where your backend returns the access token
      // Your earlier code checked: data?.data?.accessToken
      const newAccessToken: string | undefined = data?.data?.accessToken;

      if (newAccessToken) {
        // ✅ Persist so prepareHeaders uses the fresh token
        localStorage.setItem("accessToken", newAccessToken);

        // ✅ Keep existing user object, just update token field if you store it
        const user = (api.getState() as RootState).auth.user;
        if (user) {
          api.dispatch(setUser({ ...user, token: newAccessToken }));
        }

        // Retry original request with the new token now in localStorage
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearUser());
      }
    } catch (error) {
      // If refresh call fails, clear user (keeps behavior consistent)
      api.dispatch(clearUser());
    }
  }

  if (result.error?.status === 403) {
    api.dispatch(clearUser());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,

  // ✅ Added "DailyRewards"
  tagTypes: ["post", "user", "blog", "lunc-burn", "shiba-burn", "DailyRewards"],

  endpoints: () => ({}),
});
