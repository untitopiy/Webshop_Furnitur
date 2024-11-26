import { apiSlice } from '../api/apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (credentials) => ({
        url: '/products',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Product'],
    }),
    createCategory: builder.mutation({
      query: (credentials) => ({
        url: '/categories',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProductStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getAdminProducts: builder.query({
      query: ({ page, limit, query, category }) => ({
        url: `/products?page=${page}&limit=${limit}&category=${category}&query=${query}`,
      }),
      providesTags: ['Product'],
    }),
    getAdminOrders: builder.query({
      query: ({ page, limit, query }) => ({
        url: `/orders?page=${page}&limit=${limit}&query=${query}`,
      }),
      providesTags: ['Order'],
    }),
    getAdminProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
  }),
});
