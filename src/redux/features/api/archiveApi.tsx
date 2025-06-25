/* eslint-disable @typescript-eslint/no-unused-vars */
import { baseApi } from "./baseApi";

const archiveApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllArchive: build.query({
      query: () => {
        return {
          url: "/lunc-archive/all-archive",
          method: "GET",
        };
      },
    }),

    //shib api starts here
    getAllShibaBurns: build.query({
      query: (data) => {
        return {
          url: `/shiba-archive/all-shiba-burn${data}`,
          method: "GET",
        };
      },
      providesTags: ["shib-burn"],
    }),

    createShibaBurn: build.mutation({
      query: (data) => {
        return {
          url: `/shiba-archive/create-shiba-burn/${data.id}`,
          method: "POST",
          body: {
            date: data.date,
            transactionRef: data.transactionRef,
            burnCount: data.burnCount,
          },
        };
      },
      invalidatesTags: ["shib-burn"],
    }),

    updateShibaBurn: build.mutation({
      query: (data) => {
        const { id, date, ...rest } = data;
        return {
          url: `/shiba-archive/update-shiba-burn/${id}`,
          method: "PATCH",
          body: rest,
        };
      },
      invalidatesTags: ["shib-burn"],
    }),
    deleteShibaBurn: build.mutation({
      query: (id) => {
        return {
          url: `/shiba-archive/delete-shiba-burn/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["shib-burn"],
    }),
    //shib api ends here

    //lunc api starts here
    getAllLuncBurns: build.query({
      query: (data) => {
        return {
          url: `/lunc-archive/all-lunc-burn${data}`,
          method: "GET",
        };
      },
      providesTags: ["lunc-burn"],
    }),

    createLuncBurn: build.mutation({
      query: (data) => {
        return {
          url: `/lunc-archive/create-lunc-burn/${data.id}`,
          method: "POST",
          body: {
            date: data.date,
            transactionRef: data.transactionRef,
            burnCount: data.burnCount,
          },
        };
      },
      invalidatesTags: ["lunc-burn"],
    }),

    updateLuncBurn: build.mutation({
      query: (data) => {
        const { id, date, ...rest } = data;
        return {
          url: `/lunc-archive/update-lunc-burn/${id}`,
          method: "PATCH",
          body: rest,
        };
      },
      invalidatesTags: ["lunc-burn"],
    }),
    deleteLuncBurn: build.mutation({
      query: (id) => {
        return {
          url: `/lunc-archive/delete-lunc-burn/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["lunc-burn"],
    }),
    //lunc api ends here
  }),
});

export const {
  //shib burns apis
  useGetAllArchiveQuery,
  useGetAllShibaBurnsQuery,
  useCreateShibaBurnMutation,
  useUpdateShibaBurnMutation,
  useDeleteShibaBurnMutation,

  //lunc apis
  useGetAllLuncBurnsQuery,
  useCreateLuncBurnMutation,
  useUpdateLuncBurnMutation,
  useDeleteLuncBurnMutation,
} = archiveApi;
