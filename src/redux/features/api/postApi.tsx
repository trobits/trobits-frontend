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
        createComment: build.mutation({
            query: (data) => {
                return {
                    url: "/comment/create-comment",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [ "post" ]
        })
    })
})

export const { useCreatePostMutation, useCreateCommentMutation, useGetAllPostsByTopicQuery } = topicApi;