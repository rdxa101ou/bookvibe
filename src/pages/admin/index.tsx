import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import { authGuard } from '@/middleware/authGuard';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/context/DarkModeContext';
import { Edit2, Trash2, Plus } from 'lucide-react'; // 🧩 ICONS dari lucide-react

type Book = {
  id: string;
  title: string;
  author: string;
  status: string;
};

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    (async () => {
      await authGuard(router);
      fetchBooks();
    })();
  }, []);

  async function fetchBooks() {
    const { data } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    setBooks(data ?? []);
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;
    await supabase.from('books').delete().eq('id', id);
    fetchBooks();
  }

  return (
    <>
      <Navbar />
      <div
        className={`p-8 min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            📘 Dashboard Admin
          </h1>

          <button
            onClick={() => router.push('/admin/add')}
            className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              isDarkMode
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Plus size={18} />
            Tambah Buku
          </button>

          <div
            className={`rounded-xl overflow-hidden shadow-lg border ${
              isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
            }`}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr
                  className={`${
                    isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <th className="border px-3 py-2">Judul</th>
                  <th className="border px-3 py-2">Penulis</th>
                  <th className="border px-3 py-2">Status</th>
                  <th className="border px-3 py-2 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className={`text-center py-6 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Belum ada data buku.
                    </td>
                  </tr>
                ) : (
                  books.map((b) => (
                    <tr
                      key={b.id}
                      className={`transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-800 border-gray-700'
                          : 'hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <td className="border px-3 py-2">{b.title}</td>
                      <td className="border px-3 py-2">{b.author}</td>
                      <td className="border px-3 py-2 capitalize">{b.status}</td>
                      <td className="border px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => router.push(`/admin/edit/${b.id}`)}
                            className={`p-1 rounded hover:scale-110 transition-transform ${
                              isDarkMode
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-700'
                            }`}
                            title="Edit Buku"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className={`p-1 rounded hover:scale-110 transition-transform ${
                              isDarkMode
                                ? 'text-red-400 hover:text-red-300'
                                : 'text-red-600 hover:text-red-700'
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
    </>
  );
}
