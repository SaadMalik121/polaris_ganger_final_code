import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: JSON.parse(localStorage.getItem("gallery_categories")) || [
    { label: "Animal", value: "Animal" },
    { label: "Sports", value: "Sports" },
  ],
  graphicId: JSON.parse(localStorage.getItem("graphic_id")) || 6, //ref images in graphics
  gallery: JSON.parse(localStorage.getItem("gallery")) || [],

  // || [
  //   {
  //     image: [
  //       {
  //         imageId: 1,
  //         image:
  //           "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
  //       },
  //     ],
  //     category: "Sports",
  //     tags: ["Cricket", "Sports"],
  //     status: "Active",
  //   },
  //   {
  //     image: [
  //       {
  //         imageId: 2,
  //         image:
  //           "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
  //       },
  //     ],
  //     category: "Sports",
  //     tags: ["Cricket", "Sports"],
  //     status: "InActive",
  //   },
  //   {
  //     image: [
  //       {
  //         imageId: 3,
  //         image:
  //           "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
  //       },
  //     ],
  //     category: "Sports",
  //     tags: ["Cricket", "Sports"],
  //     status: "Active",
  //   },
  //   {
  //     image: [
  //       {
  //         imageId: 4,
  //         image:
  //           "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
  //       },
  //     ],
  //     category: "Animals",
  //     tags: ["Cricket", "Sports"],
  //     status: "Active",
  //   },
  //   {
  //     image: [
  //       {
  //         imageId: 5,
  //         image:
  //           "https://www.soloto.com/cdn/shop/products/M-BF-STP-0002-TAN.jpg?v=1664362609",
  //       },
  //     ],
  //     category: "Animals",
  //     tags: ["Cricket", "Sports"],
  //     status: "InActive",
  //   },
  // ],
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
    editCategoryValue(state, { payload }) {
      const { categoryToEdit, newValue } = payload;

      const categoryIndex = state.categories.findIndex(
        (category) => category.value === categoryToEdit
      );

      //update Category in category List
      state.categories[categoryIndex] = { label: newValue, value: newValue };
      localStorage.setItem(
        "gallery_categories",
        JSON.stringify(state.categories)
      );

      //also update category in graphics list, graphics which are already added with previous category
      state.gallery = state.gallery.map((gallery) =>
        gallery.category === categoryToEdit
          ? { ...gallery, category: newValue }
          : gallery
      );
      localStorage.setItem("gallery", JSON.stringify(state.gallery));
    },
    editGraphic(state, { payload }) {
      const editedGraphic = {
        ...payload,
        image: payload.image[0],
      };
      const graphicToBeEdit = state.gallery.findIndex(
        (gallery) => gallery.id === payload.id
      );

      state.gallery[graphicToBeEdit] = editedGraphic;
      localStorage.setItem("gallery", JSON.stringify(state.gallery));
    },

    addGraphic(state, { payload }) {
      payload.image.forEach((image) => {
        const newGraphic = {
          ...payload,
          id: ++state.graphicId,
          image,
        };
        state.gallery.push(newGraphic);
      });

      localStorage.setItem("gallery", JSON.stringify(state.gallery));
      localStorage.setItem("graphic_id", state.graphicId);
    },
  },
});

export const { addCategory, addGraphic, editCategoryValue, editGraphic } =
  gallerySlice.actions;

export default gallerySlice.reducer;
