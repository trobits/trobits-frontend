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
            invalidatesTags: [ "post" ,"blog"]
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
        //             // Emit comment event to notify the backend for real-time updates
        //             socket.emit("createComment", { postId, content, authorId });
        //         } catch (error) {
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
        //         try {
        //             const { data } = await queryFulfilled;
        //             // Emit like event to notify the backend for real-time updates
        //             socket.emit("addOrRemoveLike", { id, authorId });
        //         } catch (error) {
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
            invalidatesTags: [ "post","blog" ]
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
            query: (data: string) => {
  
                return {
                    url: `/post/all-post`,
                    method: "GET",

                }
            },
            providesTags: [ "post" ]
        }),
        getAllVideoPost: build.query({
            query: (data: string) => {
        
                return {
                    url: `/post/video-post`,
                    method: "GET",

                }
            },
            providesTags: [ "post" ]
        }),
        getAllImagePost: build.query({
            query: (data: string) => {
                return {
                    url: `/post/image-post`,
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

export const { useCreatePostMutation,useGetAllImagePostQuery,useGetAllVideoPostQuery, useGetPostsByUserIdQuery, useGetAllPostsQuery, useGetPostsByAuthorIdQuery, useToggleDisLikeOnCommentMutation, useToggleLikeOnCommentMutation, useGetPostsByIdQuery, useToggleLikeMutation, useCreateCommentMutation, useGetAllPostsByTopicQuery } = topicApi;


