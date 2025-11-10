import { useEffect, useState } from "react";
import useTodoStore from "@/store/todoStore";
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@/services/serviceOperations/todoService";

export default function Home() {
  const {
    todos,
    setTodos,
    addTodo,
    updateTodo: updateTodoStore,
    deleteTodo: deleteTodoStore,
  } = useTodoStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Sayfa yüklendiğinde todoları çek
  useEffect(() => {
    fetchTodos();
  }, []);

  // Todoları API'den çek
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await getAllTodos();
      if (response.success) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Todolar yüklenirken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Yeni todo oluştur
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Lütfen bir başlık girin!");
      return;
    }

    try {
      setLoading(true);
      const response = await createTodo({ title, description });
      if (response.success) {
        addTodo(response.data);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Create error:", error);
      alert("Todo eklenirken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Todo durumunu değiştir (tamamla/geri al)
  const handleToggle = async (id, currentStatus) => {
    try {
      const response = await updateTodo(id, { status: !currentStatus });
      if (response.success) {
        updateTodoStore(id, response.data);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Todo güncellenirken hata oluştu!");
    }
  };

  // Todo sil
  const handleDelete = async (id) => {
    if (!confirm("Bu todo'yu silmek istediğinize emin misiniz?")) return;

    try {
      const response = await deleteTodo(id);
      if (response.success) {
        deleteTodoStore(id);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Todo silinirken hata oluştu!");
    }
  };

  // Düzenleme modunu aç
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  // Düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  // Düzenlemeyi kaydet
  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      alert("Başlık boş olamaz!");
      return;
    }

    try {
      const response = await updateTodo(id, {
        title: editTitle,
        description: editDescription,
      });
      if (response.success) {
        updateTodoStore(id, response.data);
        cancelEdit();
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Todo güncellenirken hata oluştu!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">📝 Todo App</h1>
          <p className="text-gray-600">Görevlerinizi yönetin ve takip edin</p>
        </div>

        {/* Form - Yeni Todo Ekle */}
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow-lg mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Yeni Todo Ekle
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Başlık
              </label>
              <input
                id="title"
                type="text"
                placeholder="Örn: Alışveriş yap"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-gray-500 text-gray-800"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Açıklama
              </label>
              <textarea
                id="description"
                placeholder="Detaylı açıklama..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none placeholder:text-gray-500 text-gray-800"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold p-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Ekleniyor...
                </>
              ) : (
                <>
                  <span>➕</span>
                  Todo Ekle
                </>
              )}
            </button>
          </div>
        </form>

        {/* Todo Listesi */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
            <span>Görevler</span>
            <span className="text-sm font-normal text-gray-500">
              {todos.length} görev
            </span>
          </h2>

          {loading && todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">Henüz todo eklenmemiş</p>
              <p className="text-gray-400 text-sm mt-2">
                Yukarıdaki formdan yeni görev ekleyebilirsiniz
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    todo.status
                      ? "bg-gray-50 border-gray-300"
                      : "bg-white border-blue-200 hover:border-blue-400"
                  }`}
                >
                  {editingId === todo.id ? (
                    // DÜZENLEME MODU
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                        placeholder="Başlık"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-800"
                        placeholder="Açıklama"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                          💾 Kaydet
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          ❌ İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    // NORMAL GÖRÜNÜM
                    <div className="flex items-start justify-between gap-4">
                      {/* Todo İçeriği */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-semibold mb-1 ${
                            todo.status
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {todo.title}
                        </h3>

                        {todo.description && (
                          <p
                            className={`text-sm mb-2 ${
                              todo.status ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>📅</span>
                          <span>
                            {new Date(todo.createdAt).toLocaleDateString(
                              "tr-TR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Butonlar */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggle(todo.id, todo.status)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            todo.status
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          title={todo.status ? "Geri al" : "Tamamla"}
                        >
                          {todo.status ? "↩️" : "✓"}
                        </button>

                        <button
                          onClick={() => startEdit(todo)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                          title="Düzenle"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* İstatistikler */}
        {todos.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                {todos.length}
              </div>
              <div className="text-sm text-gray-600">Toplam</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                {todos.filter((t) => t.status).length}
              </div>
              <div className="text-sm text-gray-600">Tamamlanan</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-orange-600">
                {todos.filter((t) => !t.status).length}
              </div>
              <div className="text-sm text-gray-600">Bekleyen</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
