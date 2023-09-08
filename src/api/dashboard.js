import { postURL, api } from "./config/index";

const getDashBoardData = async () => {
  const { data } = await api.post(`/getDashboard/${postURL}`);
  return data;
};

const dashBoardApi = { getDashBoardData };
export default dashBoardApi;
