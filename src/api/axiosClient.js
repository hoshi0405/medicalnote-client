import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

const getToken = () => localStorage.getItem("token");

const axiosClient = axios.create({
  baseURL: BASE_URL,
});

// APIを叩く前に前処理を行う
axiosClient.interceptors.request.use(async (config) => {
  const token = await getToken(); // 非同期処理が含まれている場合に備えてawaitを追加

  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
});

axiosClient.interceptors.response.use(
  (response) => response.data, // レスポンスからデータだけを取得する
  (error) => {
    // エラーレスポンスを適切に処理する
    throw error.response.data;
  }
);

export default axiosClient;
