import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/`,
    prepareHeaders: async (headers) => {
      try {
        const clerk = window.Clerk;
        if (clerk && clerk.session) {
          const token = await clerk.session.getToken();
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
      return headers;
    },
  }),
  tagTypes: ["Hotels", "Locations", "Reviews", "Bookings"],
  endpoints: (build) => ({
    getAllHotels: build.query({
      query: () => "hotels",
      providesTags: ["Hotels"],
    }),
    getHotelById: build.query({
      query: (id) => `hotels/${id}`,
      providesTags: ["Hotels"],
    }),
    createHotel: build.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
      invalidatesTags: ["Hotels"],
    }),
    addLocation: build.mutation({
      query: (location) => ({
        url: "locations",
        method: "POST",
        body: {
          name: location.name,
        },
      }),
      invalidatesTags: ["Locations"],
    }),
    addReview: build.mutation({
      query: (review) => ({
        url: "reviews",
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Reviews"],
    }),
    getAllLocations: build.query({
      query: () => "locations",
      providesTags: ["Locations"],
    }),
    createBooking: build.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
      invalidatesTags: ["Bookings"],
    }),
    getBookingById: build.query({
      query: (id) => `bookings/${id}`,
      providesTags: ["Bookings"],
    }),
    getUserBookings: build.query({
      query: () => "bookings",
      providesTags: ["Bookings"],
    }),
  }),
});

export const {
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useAddLocationMutation,
  useGetAllLocationsQuery,
  useAddReviewMutation,
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useGetUserBookingsQuery,
} = api;

