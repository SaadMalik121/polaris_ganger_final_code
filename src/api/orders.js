import { postURL, api } from "./config/index";

const getOrdersListing = async ({ pageNum, payload }) => {
  //payload contains keyword and type (pending/approved etc)
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

const getOrderHistory = async (id) => {
  const { data } = await api.post(`getOrderHistory?page=1&${postURL}`, {
    id: id,
  });
  return data;
};
const ordersApi = { getOrdersListing, getOrderDetails, getOrderHistory };
export default ordersApi;
