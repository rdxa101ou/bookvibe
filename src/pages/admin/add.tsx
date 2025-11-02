import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/context/DarkModeContext';

export default function AddBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('wishlist');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    let coverUrl = null;
    if (coverFile) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(fileName, coverFile);

      if (uploadError) {
        alert('Gagal upload gambar: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('book-covers')
        .getPublicUrl(fileName);

      coverUrl = publicUrlData?.publicUrl ?? null;
    }

    const { error } = await supabase.from('books').insert([
      {
        title,
        author,
        description,
        status,
        start_date: startDate || null,
        finish_date: finishDate || null,
        current_page: currentPage,
        total_pages: totalPages,
        rating,
        notes,
        cover_url: coverUrl,
      },
    ]);

    if (error) {
      alert('Gagal menambah buku: ' + error.message);
    } else {
      alert('📖 Buku berhasil ditambahkan!');
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
          <h1 className="text-2xl font-bold mb-6">➕ Tambah Buku Baru</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Judul */}
            <input
              type="text"
              placeholder="Judul Buku"
              className={`w-full border rounded px-3 py-2 transition-colors ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Input Penulis */}
            <input
              type="text"
              placeholder="Penulis"
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            {/* Deskripsi */}
            <textarea
              placeholder="Deskripsi"
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
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
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Tanggal Selesai</label>
              <input
                type="date"
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
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
                    isDarkMode
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  placeholder="Total halaman"
                  min="1"
                  value={totalPages ?? ''}
                  onChange={(e) => setTotalPages(Number(e.target.value))}
                  className={`border rounded px-3 py-2 w-1/2 ${
                    isDarkMode
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
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
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={rating ?? ''}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>

            {/* Catatan */}
            <div>
              <label className="block mb-1">Catatan Membaca</label>
              <textarea
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Upload Cover */}
            <div>
              <label className="block mb-1 font-medium">Cover Buku</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
            </div>

            {/* Tombol Simpan */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-semibold transition ${
                isDarkMode
                  ? 'bg-blue-700 hover:bg-blue-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Menyimpan...' : 'Simpan Buku'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
