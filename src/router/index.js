import React from "react";
import { Route, Routes } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import AddGraphic from "../pages/AddGraphic";
import GalleryListing from "../pages/GalleryListing";

function MyRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/gallery-listing" element={<GalleryListing />} />
      <Route path="/add-graphic" element={<AddGraphic />} />
    </Routes>
  );
}

export default MyRouter;
