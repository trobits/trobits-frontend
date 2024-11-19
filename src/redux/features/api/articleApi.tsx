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
        getAllBlogs: build.query({
            query: () => {
                return {
                    url: "/article/all-article",
                    method: "GET"
                }
            },
            providesTags: [ 'blog' ],
        }),
        updateBlog: build.mutation({
            query: (data) => {
                console.log({ data })
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
        toggleLike: build.mutation({
            query: (data) => {
                return {
                    url: "/article/add-remove-like",
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [ "post","blog" ]
        }),

    })
})

export const { useCreateBlogMutation,
    // useGetAllSubscriberQuery,
    useGetAllBlogsQuery,
    useToggleLikeMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetSingleArticleQuery
} = blogApi;