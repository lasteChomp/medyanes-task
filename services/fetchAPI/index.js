import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getApi = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
};

export const postApi = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
};

export const putApi = async (endpoint, data) => {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error("PUT Error:", error);
    throw error;
  }
};

export const deleteApi = async (endpoint) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error("DELETE Error:", error);
    throw error;
  }
};
