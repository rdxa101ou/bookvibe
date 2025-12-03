import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { authGuard } from "@/middleware/authGuard";
import Navbar from "@/components/Navbar";
import { useDarkMode } from "@/context/DarkModeContext";
import { Edit2, Trash2, Plus, Search } from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  status: string;
  cover_url?: string | null;
  created_at?: string;
};

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    (async () => {
      await authGuard(router);
      await fetchBooks();
    })();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Gagal memuat data buku:", error.message);
    setBooks(data ?? []);
    setFilteredBooks(data ?? []);
    setLoading(false);
  }

  // 🔎 Search real-time filter
  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
    );
    setFilteredBooks(filtered);
  }, [search, books]);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus buku: " + error.message);
      return;
    }
    fetchBooks();
  }

  return (
    <>
      <Navbar />
      <div
        className={`p-8 min-h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            📘 Dashboard Admin
          </h1>

          {/* 🔎 Search Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border transition ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <Search size={18} className="opacity-60" />
              <input
                type="text"
                placeholder="Cari judul, penulis, atau status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>

            <button
              onClick={() => router.push("/admin/add")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isDarkMode
                  ? "bg-green-700 hover:bg-green-600 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          {/* 📘 Tabel Buku */}
          <div
            className={`rounded-xl shadow-lg border ${
              isDarkMode
                ? "border-gray-700 bg-gray-900"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Header tetap di atas, tabel bisa discroll */}
            <div className="max-h-[450px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <th className="border px-3 py-2 w-20 text-center">Cover</th>
                    <th className="border px-3 py-2">Judul</th>
                    <th className="border px-3 py-2">Penulis</th>
                    <th className="border px-3 py-2">Status</th>
                    <th className="border px-3 py-2 w-28 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className={`text-center py-6 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Memuat data buku...
                      </td>
                    </tr>
                  ) : filteredBooks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className={`text-center py-6 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Tidak ada buku ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((b) => (
                      <tr
                        key={b.id}
                        className={`transition-colors ${
                          isDarkMode
                            ? "hover:bg-gray-800 border-gray-700"
                            : "hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        {/* Cover */}
                        <td className="border px-3 py-2 text-center">
                          {b.cover_url ? (
                            <img
                              src={b.cover_url}
                              alt={b.title}
                              className="w-12 h-16 object-cover rounded mx-auto"
                            />
                          ) : (
                            <span
                              className={`text-sm italic ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              -
                            </span>
                          )}
                        </td>

                        {/* Info */}
                        <td className="border px-3 py-2 font-medium">
                          {b.title}
                        </td>
                        <td className="border px-3 py-2">{b.author}</td>
                        <td className="border px-3 py-2 capitalize">
                          {b.status}
                        </td>

                        {/* Aksi */}
                        <td className="border px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => router.push(`/admin/edit/${b.id}`)}
                              className={`p-1 rounded hover:scale-110 transition-transform ${
                                isDarkMode
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-700"
                              }`}
                              title="Edit Buku"
                            >
                              <Edit2 size={18} />
                            </button>

                            <button
                              onClick={() => handleDelete(b.id)}
                              className={`p-1 rounded hover:scale-110 transition-transform ${
                                isDarkMode
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-700"
                              }`}
                              title="Hapus Buku"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
