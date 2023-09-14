import { postURL, api } from "./config/index";

const getOrdersListing = async ({ pageNum, payload }) => {
  console.log(payload);
  const { data } = await api.post(
    `getOrders?page=${pageNum ? pageNum : "1"}&${postURL}`,
    { ...payload }
  );
  return data;
};

const getOrderDetails = async (id) => {
  const { data } = await api.post(`orderDetail/${id}?${postURL}`);
  return data;
};

const ordersApi = { getOrdersListing, getOrderDetails };
export default ordersApi;
