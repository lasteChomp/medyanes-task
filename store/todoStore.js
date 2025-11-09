import { create } from "zustand";

const useTodoStore = create((set) => ({
  // State
  todos: [],
  loading: false,
  error: null,

  // Tüm todoları set et
  setTodos: (todos) => set({ todos }),

  // Yeni todo ekle (listenin başına)
  addTodo: (todo) =>
    set((state) => ({
      todos: [todo, ...state.todos],
    })),

  // Todo güncelle
  updateTodo: (id, updatedData) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedData } : todo
      ),
    })),

  // Todo sil
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  // Loading state
  setLoading: (loading) => set({ loading }),

  // Error state
  setError: (error) => set({ error }),

  // Tüm state'i sıfırla
  reset: () => set({ todos: [], loading: false, error: null }),
}));

export default useTodoStore;
