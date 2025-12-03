import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/context/DarkModeContext';

export default function EditBookPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isDarkMode } = useDarkMode();

  // Semua state SAMA dengan AddBook
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('wishlist');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const [loading, setLoading] = useState(false);

  // Ambil data buku
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

    // Set semua datanya
    setTitle(data.title);
    setAuthor(data.author);
    setDescription(data.description || '');
    setStatus(data.status);
    setStartDate(data.start_date || '');
    setFinishDate(data.finish_date || '');
    setPurchaseDate(data.purchase_date || '');
    setCurrentPage(data.current_page);
    setTotalPages(data.total_pages);
    setRating(data.rating);
    setNotes(data.notes || '');
    setCoverUrl(data.cover_url || '');
  }

  // Update buku
  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
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
        start_date: startDate || null,
        finish_date: finishDate || null,
        purchase_date: purchaseDate || null,
        current_page: currentPage,
        total_pages: totalPages,
        rating,
        notes,
        cover_url: coverUrl || null,
      })
      .eq('id', bookId);

    if (error) {
      alert('Gagal memperbarui buku: ' + error.message);
    } else {
      alert('📘 Buku berhasil diperbarui!');
      router.push('/admin');
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen p-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-6">✏️ Edit Buku</h1>

          <form onSubmit={handleUpdate} className="space-y-4">

            {/* Judul */}
            <input
              type="text"
              placeholder="Judul Buku"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-300'
              }`}
              required
            />

            {/* Penulis */}
            <input
              type="text"
              placeholder="Penulis"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              }`}
              required
            />

            {/* Deskripsi */}
            <textarea
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              }`}
            />

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              }`}
            >
              <option value="wishlist">Ingin Dibaca</option>
              <option value="reading">Sedang Dibaca</option>
              <option value="completed">Selesai Dibaca</option>
            </select>

            {/* Tanggal */}
            <div>
              <label className="block mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1">Tanggal Selesai</label>
              <input
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1">Tanggal Beli</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Progress */}
            <div>
              <label className="block mb-1">Progress Membaca</label>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Halaman saat ini"
                  min="0"
                  value={currentPage ?? ''}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className={`border rounded px-3 py-2 w-1/2 ${
                    isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                  }`}
                />

                <input
                  type="number"
                  placeholder="Total halaman"
                  min="1"
                  value={totalPages ?? ''}
                  onChange={(e) => setTotalPages(Number(e.target.value))}
                  className={`border rounded px-3 py-2 w-1/2 ${
                    isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block mb-1">Rating (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating ?? ''}
                onChange={(e) => setRating(Number(e.target.value))}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-1">Catatan Membaca</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                }`}
                rows={3}
              />
            </div>

            {/* Cover */}
            <div>
              <label className="block mb-1 font-medium">URL Cover Buku</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />

              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="cover preview"
                  className="mt-3 w-32 h-auto rounded shadow"
                />
              )}
            </div>

            {/* Simpan */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-semibold ${
                isDarkMode
                  ? 'bg-blue-700 hover:bg-blue-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
