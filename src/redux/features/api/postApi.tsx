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

export const { useCreatePostMutation,useGetPostsByUserIdQuery ,useGetAllPostsQuery, useGetPostsByAuthorIdQuery, useToggleDisLikeOnCommentMutation, useToggleLikeOnCommentMutation, useGetPostsByIdQuery, useToggleLikeMutation, useCreateCommentMutation, useGetAllPostsByTopicQuery } = topicApi;


