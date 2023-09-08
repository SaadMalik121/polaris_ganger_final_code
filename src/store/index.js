import { configureStore } from "@reduxjs/toolkit";
import dashBoardSlice from "./dashBoardSlice";
import gallerySlice from "./GallerySlice";

export const store = configureStore({
  reducer: {
    dashboard: dashBoardSlice,
    gallery: gallerySlice,
  },
});
