import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashBoardApi from "../api/dashboard";

const initialState = {
  dashBoardData: "",
  dashBoardDataFetchStatus: "",
};

const initializeDashBoardData = createAsyncThunk(
  "dashboard/getData",
  async () => {
    const response = await dashBoardApi.getDashBoardData();
    return response;
  }
);
export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateProduct: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(initializeDashBoardData.fulfilled, (state, actions) => {
      state.dashBoardDataFetchStatus = "fulfilled";
      state.dashBoardData = actions.payload;
    });
    builder.addCase(initializeDashBoardData.pending, (state, actions) => {
      state.dashBoardDataFetchStatus = "pending";
    });
    builder.addCase(initializeDashBoardData.rejected, (state, actions) => {
      state.dashBoardDataFetchStatus = "rejected";
    });
  },
});

export const {} = dashboardSlice.actions;
export { initializeDashBoardData };

export const getDashboard = (state) => state.dashboard.dashBoardData;
export const getDashBoardDataStatus = (state) =>
  state.dashboard.dashBoardDataFetchStatus;

export default dashboardSlice.reducer;
