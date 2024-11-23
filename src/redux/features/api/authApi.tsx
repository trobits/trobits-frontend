/* eslint-disable @typescript-eslint/no-unused-vars */
import { baseApi } from "./baseApi";
import socket from "./socketClient";



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
        verifyOtp: build.mutation({
            query: (data) => {
                return {
                    url: `/user/verify-otp `,
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

        // toggleFollow: build.mutation({
        //     query: (data) => ({
        //         url: "/user/follow-user",
        //         method: "PATCH",
        //         body: data,
        //     }),
        //     async onQueryStarted({ followerId, followedId }, { dispatch, queryFulfilled }) {
        //         try {
        //             const { data } = await queryFulfilled;

        //             // Log to confirm that socket.emit is being called

        //             // Emit follow event to notify the backend for real-time updates
        //             socket.emit("toggleFollow", { followerId, followedId });

        //             // Log the data received from the query fulfillment
        //         } catch (error) {
        //         }
        //     },
        // }),



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
        }),

        getNotificationByUserid: build.query({
            query: (userId) => {
                return {
                    url: `/user/notifications/${userId}`,
                    method: "GET",

                }
            },
            providesTags: [ "user" ]
        }),
        getAllRecommendedUsers: build.query({
            query: () => {
                return {
                    url: `/user/recommended-users`,
                    method: "GET",
                }
            },
            // providesTags: [ "recommended-user" ]
        }),
        getAllVerifiedUsers: build.query({
            query: () => {
                return {
                    url: `/user/verified-users`,
                    method: "GET",
                }
            },
            // providesTags: [ "verified-user" ]
        }),
        forgotPassword: build.mutation({
            query: (data) => {
                return {
                    url: `/user/forgot-password`,
                    method: "POST",
                    body: data
                }
            }
        }),
        setNewPassword: build.mutation({
            query: (data) => {
                return {
                    url: `/user/new-password`,
                    method: "PATCH",
                    body: data
                }
            }
        }),
        contactUs: build.mutation({
            query: (data) => {
                return {
                    url: `/contactus/send-email`,
                    method: "POST",
                    body: data
                }
            }
        }),
    })
})

export const {
    useLoginUserMutation,
    useContactUsMutation,
    useForgotPasswordMutation,
    useSetNewPasswordMutation,
    useGetAllVerifiedUsersQuery,
    useGetAllRecommendedUsersQuery,
    useVerifyOtpMutation,
    useGetNotificationByUseridQuery,
    useUpdateProfileInfoMutation,
    useGetUserByIdQuery,
    useToggleFollowMutation,
    useRecommendedUserQuery,
    useAllUserQuery,
    useCreateuserMutation,
    useLogoutQuery,
    useLazyLogoutQuery } = authApi;