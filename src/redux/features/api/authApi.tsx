import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        loginUser: build.mutation({
            query: (data) => {
                return {
                    url: `/user/login `,
                    method: "POST",
                    body: data
                }
            }
        }),
        createuser: build.mutation({
            query: (data) => {
                return {
                    url: `/user/create-user `,
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [ "user" ]
        }),
        logout: build.query({
            query: () => {
                return {
                    url: "/user/logout",
                    method: "GET"
                }
            }
        }),
        allUser: build.query({
            query: () => {
                return {
                    url: "/user/all-users",
                    method: "GET"
                }
            },
            providesTags: [ "user" ]
        }),
        recommendedUser: build.query({
            query: () => {
                return {
                    url: "/user/recommended-users",
                    method: "GET"
                }
            },
            // providesTags: [ "user" ]
        }),
        toggleFollow: build.mutation({
            query: (data) => {
                return {
                    url: "/user/follow-user",
                    method: "PATCH",
                    body: data
                }
            },
            // invalidatesTags: [ "user" ]
        }),
        getUserById: build.query({
            query: (userId) => {
                return {
                    url: `/user/singleUser/${userId}`,
                    method: "GET",

                }
            },
            providesTags: [ "user" ]
        }),
        updateProfileInfo: build.mutation({
            query: ({ data, userId: userEmail }) => {
                return {
                    url: `/user/update-user/${userEmail}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [ "user" ]
        })
    })
})

export const { useLoginUserMutation, useUpdateProfileInfoMutation, useGetUserByIdQuery, useToggleFollowMutation, useRecommendedUserQuery, useAllUserQuery, useCreateuserMutation, useLogoutQuery, useLazyLogoutQuery } = authApi;