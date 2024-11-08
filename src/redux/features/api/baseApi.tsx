// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // Define a service using a base URL and expected endpoints
// export const baseApi = createApi({
//     reducerPath: "baseApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: "http://localhost:5000/api/v1",
//         // baseUrl: "https://sisiku-backend.vercel.app/api/v1",
//         credentials: "include",
//         prepareHeaders: (headers, { }) => {
//             const token = localStorage.getItem("accessToken");
//             if (token) {
//                 headers.set("authorization", `Bearer ${token}`);
//             }

//             return headers;
//         },

//     }),
//     tagTypes: [ "blog" ],
//     endpoints: () => ({}),
// });





import { RootState } from "@/redux/store";
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { setUser } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api/v1",
    baseUrl: "https://sisiku-backend.vercel.app/api/v1",
    credentials: "include",
    prepareHeaders: (headers, { }) => {
        const token = localStorage.getItem("refreshToken");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        try {
            const res = await fetch("http://localhost:5000/api/v1/user/access-token", {
                method: "POST",
                credentials: "include", // Sends cookies with the request
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data?.data?.accessToken) {
                const user = (api.getState() as RootState).auth.user;

                // Dispatch new access token to update state
                api.dispatch(setUser({ ...user, token: data.token.accessToken }));

                // Retry the original query with the new token
                result = await baseQuery(args, api, extraOptions);
            } else {
                // api.dispatch(clearUser());
                console.error("it will fixed very soon!");
            }
        } catch (error) {
            console.error("Error during token refresh:", error);
        }
    }

    return result;
};



export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: [ "post" ],
    endpoints: () => ({}),
});