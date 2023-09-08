import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: JSON.parse(localStorage.getItem("gallery_categories")) || [
    { label: "Animal", value: "Animal" },
    { label: "Sports", value: "Sports" },
  ],
  graphicId: JSON.parse(localStorage.getItem("graphic_id")) || 6,
  gallery: JSON.parse(localStorage.getItem("gallery")) || [
    {
      id: 1,
      image: [
        "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
      ],
      category: "Sports",
      tags: ["Cricket", "Sports"],
      status: "Active",
    },
    {
      id: 2,
      image: [
        "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
      ],
      category: "Sports",
      tags: ["Cricket", "Sports"],
      status: "InActive",
    },
    {
      id: 3,
      image: [
        "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
      ],
      category: "Sports",
      tags: ["Cricket", "Sports"],
      status: "Active",
    },
    {
      id: 4,
      image: [
        "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
      ],
      category: "Animals",
      tags: ["Cricket", "Sports"],
      status: "Active",
    },
    {
      id: 5,
      image: [
        "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
      ],
      category: "Animals",
      tags: ["Cricket", "Sports"],
      status: "InActive",
    },
  ],
};

export const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    addCategory(state, { payload }) {
      const newCategory = { label: payload, value: payload };
      state.categories.push(newCategory);
      localStorage.setItem(
        "gallery_categories",
        JSON.stringify(state.categories)
      );
    },
    addGraphic(state, { payload }) {
      state.gallery.push({ ...payload, id: ++state.graphicId });
      localStorage.setItem("gallery", JSON.stringify(state.gallery));
      localStorage.setItem("graphic_id", state.graphicId);
    },
  },
});

export const { addCategory, addGraphic } = gallerySlice.actions;

export default gallerySlice.reducer;
