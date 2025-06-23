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
  credentials: "include",
  prepareHeaders: (headers, {}) => {
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
      // const res = await fetch(
      //   "http://localhost:3000/api/v1/user/access-token",
      //   {
      // const res = await fetch("https://sisiku-backend.vercel.app/api/v1", {
      const res = await fetch(
        "https://api.trobits.com/api/v1/user/access-token",
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

      if (data?.data?.accessToken) {
        const user = (api.getState() as RootState).auth.user;

        // Dispatch new access token to update state
        api.dispatch(setUser({ ...user, token: data.token.accessToken }));

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearUser());
      }
    } catch (error) {}
  }
  if (result.error?.status === 403) {
    api.dispatch(clearUser());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["post", "user", "blog", "lunc-burn", "shiba-burn"],
  endpoints: () => ({}),
});
