import React from "react";
import { Route, Routes } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import AddGraphic from "../pages/gallery/AddGraphic";
import GalleryListing from "../pages/gallery/GalleryListing";
import EditGraphic from "../pages/gallery/EditGraphic";
import OrdersListing from "../pages/orders/OrdersListing";
import OrderDetails from "../pages/orders/OrderDetails";

function MyRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/gallery-listing" element={<GalleryListing />} />
      <Route path="/add-graphic" element={<AddGraphic />} />
      <Route path="/edit-graphic/:id" element={<EditGraphic />} />
      <Route path="/order-listing" element={<OrdersListing />} />
      <Route path="/order-details/:id" element={<OrderDetails />} />
    </Routes>
  );
}

export default MyRouter;
