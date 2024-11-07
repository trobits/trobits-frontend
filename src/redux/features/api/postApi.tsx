import { baseApi } from "./baseApi";

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


    })
})

export const { useCreatePostMutation,useToggleDisLikeOnCommentMutation,useToggleLikeOnCommentMutation,useGetPostsByIdQuery,useToggleLikeMutation, useCreateCommentMutation, useGetAllPostsByTopicQuery } = topicApi;


