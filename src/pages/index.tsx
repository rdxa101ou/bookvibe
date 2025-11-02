import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/context/DarkModeContext'; // ✅ pakai context

type Book = {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  status: string;
};

type Props = {
  books: Book[];
};

export default function Home({ books }: Props) {
  const { isDarkMode } = useDarkMode(); // ✅ akses dark mode global
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'wishlist' | 'reading' | 'completed'>(
    'all'
  );

  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || book.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <Navbar /> {/* ✅ Navbar sudah punya toggle-nya sendiri */}

      <main className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📚 Koleksi Buku</h1>

        {/* 🔍 Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full sm:w-2/3 border px-3 py-2 rounded outline-none transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            }`}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={`border px-3 py-2 rounded transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="all">Semua</option>
            <option value="wishlist">Ingin Dibaca</option>
            <option value="reading">Sedang Dibaca</option>
            <option value="completed">Selesai Dibaca</option>
          </select>
        </div>

        {/* 🧱 Grid Buku */}
        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada buku yang cocok.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`}>
                <div
                  className={`cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-lg transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`h-56 flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      No Cover
                    </div>
                  )}
                  <div className="p-3">
                    <h2 className="font-semibold text-lg truncate">{book.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// 🚀 Ambil data dari Supabase
export const getServerSideProps: GetServerSideProps = async () => {
  const { data: books, error } = await supabase
    .from('books')
    .select('id, title, author, cover_url, status')
    .order('created_at', { ascending: false });

  if (error) console.error(error);

  return {
    props: { books: books ?? [] },
  };
};
