import { baseApi } from "./baseApi";

const currencyApi = baseApi.injectEndpoints({
    endpoints: (build) => ({

        getShibaInformation: build.query({
            query: () => {
                return {
                    url: "/shiba/get-shiba",
                    method: "GET"
                }
            },
        }),
        getLuncInformation: build.query({
            query: () => {
                return {
                    url: "/lunc/get-lunc",
                    method: "GET"
                }
            },
        }),
        updateShiba: build.mutation({
            query: (data) => {
                return {
                    url: `/shiba/update-shiba`,
                    method: "PATCH",
                    body: data
                }
            },
        }),
        updateLunc: build.mutation({
            query: (data) => {
                return {
                    url: `/lunc/update-lunc`,
                    method: "PATCH",
                    body: data
                }
            },
        }),


    })
})

export const {
    useGetShibaInformationQuery,
    useGetLuncInformationQuery,
    useUpdateShibaMutation,
    useUpdateLuncMutation
} = currencyApi;