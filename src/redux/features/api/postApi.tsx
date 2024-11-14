/* eslint-disable @typescript-eslint/no-unused-vars */
import { baseApi } from "./baseApi";
import socket from "./socketClient";

const topicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({

        createPost: build.mutation({
            query: (data) => {
                return {
                    url: `/post/create-post`,
                    method: "POST",
                    body: data

                }
            },
            invalidatesTags: [ "post" ]
        }),
        getAllPostsByTopic: build.query({
            query: (topicId) => {
                return {
                    url: `/post/all-posts/${topicId}`,
                    method: "GET",


                }
            },
            providesTags: [ "post" ]
        }),
        getPostsById: build.query({
            query: (postId) => {
                return {
                    url: `/post/${postId}`,
                    method: "GET",

                    // 
                }
            },
            providesTags: [ "post" ]
        }),


        createComment: build.mutation({
            query: (data) => {
                return {
                    url: "/comment/create-comment",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [ "post" ]
        }),



        toggleLike: build.mutation({
            query: (data) => {
                return {
                    url: "/post/add-remove-like",
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [ "post" ]
        }),

        // createComment: build.mutation({
        //     query: (data) => ({
        //         url: "/comment/create-comment",
        //         method: "POST",
        //         body: data,
        //     }),
        //     async onQueryStarted({ postId, content, authorId }, { dispatch, queryFulfilled }) {
        //         try {
        //             const { data } = await queryFulfilled;
        //             console.log({ data })
        //             // Emit comment event to notify the backend for real-time updates
        //             socket.emit("createComment", { postId, content, authorId });
        //         } catch (error) {
        //             console.error("Error creating comment:", error);
        //         }
        //     },
        //     invalidatesTags: [ "post" ]
        // }),


        // toggleLike: build.mutation({
        //     query: (data) => ({
        //         url: "/post/add-remove-like",
        //         method: "PATCH",
        //         body: data,
        //     }
        // ),
        // invalidatesTags: [ "post" ],
        // async onQueryStarted({ id, authorId }, { queryFulfilled }) {
        //         console.log("hit")
        //         try {
        //             const { data } = await queryFulfilled;
        //             // Emit like event to notify the backend for real-time updates
        //             socket.emit("addOrRemoveLike", { id, authorId });
        //             console.log({data})
        //         } catch (error) {
        //             console.error("Error liking/unliking post:", error);
        //         }
        //     },
        // }),


        toggleLikeOnComment: build.mutation({
            query: (data) => {
                return {
                    url: "/comment/add-remove-like",
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [ "post" ]
        }),

        toggleDisLikeOnComment: build.mutation({
            query: (data) => {
                return {
                    url: "/comment/add-remove-dislike",
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [ "post" ]
        }),
        getPostsByAuthorId: build.query({
            query: (authorId) => {
                return {
                    url: `/post/author/${authorId}`,
                    method: "GET",

                    // 
                }
            },
            providesTags: [ "post" ]
        }),
        getAllPosts: build.query({
            query: () => {
                return {
                    url: `/post/all-posts`,
                    method: "GET",

                }
            },
            providesTags: [ "post" ]
        }),
        getPostsByUserId: build.query({
            query: (userId) => {
                return {
                    url: `post/author/${userId}`,
                    method: "GET",

                }
            },
        }),



    })
})

export const { useCreatePostMutation, useGetPostsByUserIdQuery, useGetAllPostsQuery, useGetPostsByAuthorIdQuery, useToggleDisLikeOnCommentMutation, useToggleLikeOnCommentMutation, useGetPostsByIdQuery, useToggleLikeMutation, useCreateCommentMutation, useGetAllPostsByTopicQuery } = topicApi;


