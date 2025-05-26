import { baseApi } from "./baseApi";

const blogApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createBlog: build.mutation({
            query: (blogData) => {
                return {
                    url: "/article/create-article",
                    method: "POST",
                    body: blogData
                }
            }
        }),

        // getAllBlogs: build.query({
        //     query: () => {
        //         return {
        //             url: "/article/all-article",
        //             method: "GET"
        //         }
        //     },
        //     providesTags: [ 'blog' ],
        // }),

        getAllBlogs: build.query({
            query: ({ page = 1, limit = 23, sortBy = "createdAt", sortOrder = "desc" }) => {
                return {
                    url: `/article/all-article?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
                    method: "GET",
                };
            },
            providesTags: [ 'blog' ],
        }),


        updateBlog: build.mutation({
            query: (data) => {
                return {
                    url: `/article/update-article`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [ 'blog' ]
        }),

        deleteBlog: build.mutation({
            query: (id) => {

                return {
                    url: `/article/delete-article/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: [ 'blog' ]
        }),


        getSingleArticle: build.query({
            query: (id: string) => {
                return {
                    url: `/article/${id}`,
                    method: "GET"
                }
            },
            providesTags: [ 'blog' ],
        }),
        likeToggle: build.mutation({
            query: (data) => {
                return {
                    url: "/article/toggle-like",
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [ "blog" ]
        }),

    })
})

export const { useCreateBlogMutation,
    // useGetAllSubscriberQuery,
    useGetAllBlogsQuery,
    useLikeToggleMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetSingleArticleQuery
} = blogApi;