import { getApi, postApi, putApi, deleteApi } from "../fetchAPI";

// Tüm todoları getir
export const getAllTodos = async () => {
  try {
    return await getApi("/api/todos");
  } catch (error) {
    console.error("getAllTodos error:", error);
    throw error;
  }
};

// Tek bir todo getir
export const getTodoById = async (id) => {
  try {
    return await getApi(`/api/todos/${id}`);
  } catch (error) {
    console.error("getTodoById error:", error);
    throw error;
  }
};

// Yeni todo oluştur
export const createTodo = async (data) => {
  try {
    return await postApi("/api/todos", data);
  } catch (error) {
    console.error("createTodo error:", error);
    throw error;
  }
};

// Todo güncelle
export const updateTodo = async (id, data) => {
  try {
    return await putApi(`/api/todos/${id}`, data);
  } catch (error) {
    console.error("updateTodo error:", error);
    throw error;
  }
};

// Todo sil
export const deleteTodo = async (id) => {
  try {
    return await deleteApi(`/api/todos/${id}`);
  } catch (error) {
    console.error("deleteTodo error:", error);
    throw error;
  }
};
