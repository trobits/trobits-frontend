import { baseApi } from "./baseApi";

const topicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllTopic: build.query({
            query: () => {
                return {
                    url: `/topic/topics `,
                    method: "GET",

                }
            }
        }),
        getTopicById: build.query({
            query: (topicid) => {
                return {
                    url: `/topic/${topicid} `,
                    method: "GET",

                }
            }
        }),
        logout: build.query({
            query: () => {
                return {
                    url: "/user/logout",
                    method: "GET"
                }
            }
        })
    })
})

export const { useGetAllTopicQuery, useGetTopicByIdQuery, useLogoutQuery, useLazyLogoutQuery } = topicApi;