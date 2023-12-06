import axios from "axios";

export const activate = async (token) => {
  return (await (axios.post("/api/users/token/" + token))).data;
};

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const fetchUsers = async () => {
  return (await axios.get(`${BASE_URL}/users`)).data;
};

export const createUser = async (user) => {
  return (await axios.post(`${BASE_URL}/users`, user)).data;
};