import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/context/DarkModeContext';

type Book = {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_url?: string | null;
  status: string;
  rating?: number | null;
  notes?: string | null;
  start_date?: string | null;
  finish_date?: string | null;
  current_page?: number | null;
  total_pages?: number | null;
};

export default function EditBookPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isDarkMode } = useDarkMode();

  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('wishlist');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Ambil data buku berdasarkan ID
  useEffect(() => {
    const bookId = Array.isArray(id) ? id[0] : id;
    if (bookId) fetchBook(bookId);
  }, [id]);

  async function fetchBook(bookId: string) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (error || !data) {
      alert('Gagal mengambil data buku: ' + error?.message);
      router.push('/admin');
      return;
    }

    setBook(data);
    setTitle(data.title);
    setAuthor(data.author);
    setDescription(data.description || '');
    setStatus(data.status);
    setCoverUrl(data.cover_url || '');
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!book) return;
    setLoading(true);

    const bookId = Array.isArray(id) ? id[0] : id;
    if (!bookId) return;

    const { error } = await supabase
      .from('books')
      .update({
        title,
        author,
        description,
        status,
        cover_url: coverUrl || null,
        rating: book.rating ?? null,
        notes: book.notes ?? null,
        start_date: book.start_date ?? null,
        finish_date: book.finish_date ?? null,
        current_page: book.current_page ?? null,
        total_pages: book.total_pages ?? null,
      })
      .eq('id', bookId);

    if (error) {
      alert('Gagal memperbarui buku: ' + error.message);
    } else {
      alert('✅ Buku berhasil diperbarui!');
      router.push('/admin');
    }

    setLoading(false);
  }

  if (!book) {
    return (
      <p
        className={`p-8 text-center ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        Memuat data buku...
      </p>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen flex flex-col items-center transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div
          className={`mt-8 mb-8 p-6 rounded-xl shadow-lg w-full max-w-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <h1 className="text-2xl font-bold mb-4">✏️ Edit Buku</h1>

          <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Judul & Penulis */}
              <input
                type="text"
                placeholder="Judul Buku"
                className={`border rounded px-3 py-2 w-full ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Penulis"
                className={`border rounded px-3 py-2 w-full ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                }`}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />

              {/* Deskripsi */}
              <textarea
                placeholder="Deskripsi"
                className={`border rounded px-3 py-2 w-full ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Status */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`border rounded px-3 py-2 w-full ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="wishlist">Ingin Dibaca</option>
                <option value="reading">Sedang Dibaca</option>
                <option value="completed">Selesai Dibaca</option>
              </select>

              {/* Cover URL */}
              <div>
                <label className="block font-medium mb-1">Link Cover (URL)</label>
                <input
                  type="url"
                  placeholder="https://contoh.com/cover.jpg"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className={`border rounded px-3 py-2 w-full ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                {coverUrl && (
                  <img
                    src={coverUrl}
                    alt="cover"
                    className="w-32 h-48 object-cover rounded mt-2 mx-auto"
                  />
                )}
              </div>

              {/* Progress */}
              <div>
                <label className="block mb-1">Progress Membaca</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Halaman saat ini"
                    value={book.current_page ?? ''}
                    onChange={(e) =>
                      setBook({
                        ...book,
                        current_page: Number(e.target.value),
                      })
                    }
                    className={`border px-3 py-2 rounded w-1/2 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Total halaman"
                    value={book.total_pages ?? ''}
                    onChange={(e) =>
                      setBook({
                        ...book,
                        total_pages: Number(e.target.value),
                      })
                    }
                    className={`border px-3 py-2 rounded w-1/2 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Rating & Catatan */}
              <div>
                <label className="block mb-1">Rating (1–5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={book.rating || ''}
                  onChange={(e) =>
                    setBook({
                      ...book,
                      rating: Number(e.target.value),
                    })
                  }
                  className={`border px-3 py-2 rounded w-full ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1">Catatan Membaca</label>
                <textarea
                  value={book.notes || ''}
                  onChange={(e) =>
                    setBook({
                      ...book,
                      notes: e.target.value,
                    })
                  }
                  className={`border px-3 py-2 rounded w-full ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                  rows={3}
                />
              </div>

              {/* Tombol Simpan */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 w-full py-2 px-4 rounded transition-colors duration-300 ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
