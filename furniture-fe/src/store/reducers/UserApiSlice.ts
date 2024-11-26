import { apiSlice } from '../api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (credentials) => ({
        url: '/orders',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrders: builder.query({
      query: ({ page, limit }) => ({
        url: `/orders?page=${page}&limit=${limit}`,
      }),
      providesTags: ['Order'],
    }),
    getCategories: builder.query({
      query: () => ({
        url: `/categories`,
      }),
      providesTags: ['Category'],
    }),
  }),
});
