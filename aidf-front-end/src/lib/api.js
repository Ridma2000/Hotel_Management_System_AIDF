import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const getAllHotels = async () => {
//   try {
//     const res = await fetch("http://localhost:8000/api/hotels", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch hotels");
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const getAllLocations = async () => {
//   try {
//     const res = await fetch("http://localhost:8000/api/locations", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch locations");
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export { getAllHotels, getAllLocations };

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/`,
    prepareHeaders: async (headers) => {
      return new Promise((resolve, reject) => {
        const maxRetries = 20; // 10 seconds max wait
        let retries = 0;
        
        async function checkToken() {
          const clerk = window.Clerk;
          if (clerk && clerk.session) {
            try {
              const token = await clerk.session.getToken();
              if (token) {
                headers.set("Authorization", `Bearer ${token}`);
                console.log("Auth token set successfully");
              } else {
                console.warn("No token received from Clerk");
              }
              resolve(headers);
            } catch (error) {
              console.error("Error getting token:", error);
              // Don't reject, just resolve with headers to allow request to proceed
              resolve(headers);
            }
          } else {
            retries++;
            if (retries < maxRetries) {
              setTimeout(checkToken, 500);
            } else {
              console.error("Clerk not ready after max retries");
              resolve(headers); // Resolve anyway to allow the request
            }
          }
        }
        checkToken();
      });
    },
  }),
  tagTypes: ["Hotels", "Locations", "Reviews"],
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useAddLocationMutation,
  useGetAllLocationsQuery,
  useAddReviewMutation,
} = api;

