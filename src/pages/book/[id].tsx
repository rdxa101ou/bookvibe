import { GetServerSideProps } from "next";
import Head from "next/head";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useDarkMode } from "@/context/DarkModeContext";

// 🆕 tambah purchase_date & price ke tipe Book
type Book = {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_url?: string;
  status: string;
  rating?: number | null;
  notes?: string | null;
  start_date?: string | null;
  finish_date?: string | null;
  current_page?: number | null;
  total_pages?: number | null;
  created_at: string;
  purchase_date?: string | null;
  price?: number | null; // 🆕 harga buku
};

type Props = {
  book: Book | null;
};

export default function BookDetail({ book }: Props) {
  const { isDarkMode } = useDarkMode();

  if (!book)
    return (
      <>
        <Navbar />
        <div
          className={`p-8 text-center ${
            isDarkMode
              ? "bg-gray-950 text-gray-200"
              : "bg-gray-50 text-gray-700"
          }`}
        >
          <p className="mb-3 text-lg font-medium">Buku tidak ditemukan.</p>
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 shadow-sm hover:shadow-md border
              ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            <span className="text-lg">←</span> Kembali
          </Link>
        </div>
      </>
    );

  const progress =
    book.current_page && book.total_pages
      ? Math.min(Math.round((book.current_page / book.total_pages) * 100), 100)
      : null;

  return (
    <>
      <Head>
        <title>{book.title} — Detail Buku</title>
      </Head>

      <Navbar />

      <main
        className={`p-8 min-h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Link
          href="/"
          className={`inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg text-sm font-medium
            transition-all duration-200 shadow-sm hover:shadow-md border
            ${
              isDarkMode
                ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
        >
          <span className="text-lg">←</span> Kembali
        </Link>

        <div
          className={`flex flex-col md:flex-row gap-8 p-6 rounded-xl shadow-md transition-colors ${
            isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          {/* Cover */}
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full md:w-64 h-80 object-cover rounded-xl shadow-lg"
            />
          ) : (
            <div
              className={`w-full md:w-64 h-80 flex items-center justify-center rounded-xl ${
                isDarkMode
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              No Cover
            </div>
          )}

          {/* Detail Buku */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
            <p className="text-gray-500 mb-3">oleh {book.author}</p>

            {/* Status */}
            <span
              className={`text-xs rounded px-2 py-1 inline-block mb-5 ${
                book.status === "completed"
                  ? "bg-green-200 text-green-800"
                  : book.status === "reading"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-200 text-gray-700"
              } dark:${
                book.status === "completed"
                  ? "bg-green-800 text-green-100"
                  : book.status === "reading"
                  ? "bg-blue-800 text-blue-100"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {book.status === "wishlist"
                ? "Ingin Dibaca"
                : book.status === "reading"
                ? "Sedang Dibaca"
                : "Selesai Dibaca"}
            </span>

            {/* Deskripsi */}
            <p className="leading-relaxed mb-6">
              {book.description || "Belum ada deskripsi buku."}
            </p>

            {/* Progress */}
            {progress !== null && (
              <div className="mb-6">
                <p className="font-medium mb-1">Progress Membaca:</p>
                <div
                  className={`w-full rounded-full h-3 overflow-hidden ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  {book.current_page}/{book.total_pages} halaman ({progress}%)
                </p>
              </div>
            )}

            {/* Rating */}
            {book.rating && book.rating > 0 && (
              <div className="mb-5">
                <p className="font-medium mb-1">Rating:</p>
                <div className="text-yellow-500 text-xl">
                  {"⭐".repeat(Math.min(book.rating, 5))}
                </div>
              </div>
            )}

            {/* 🆕 Harga Buku */}
            {book.price !== null && book.price !== undefined && (
              <div className="mb-5">
                <p className="font-medium mb-1">Harga Buku:</p>
                <p className="text-lg font-semibold text-emerald-500 dark:text-emerald-300">
                  Rp {book.price.toLocaleString("id-ID")}
                </p>
              </div>
            )}

            {/* Periode membaca */}
            {(book.start_date || book.finish_date) && (
              <div className="mb-5">
                <p className="font-medium mb-1">Periode Membaca:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {book.start_date
                    ? new Date(book.start_date).toLocaleDateString("id-ID")
                    : "—"}{" "}
                  s/d{" "}
                  {book.finish_date
                    ? new Date(book.finish_date).toLocaleDateString("id-ID")
                    : "—"}
                </p>
              </div>
            )}

            {/* Catatan */}
            {book.notes && (
              <div className="mb-5">
                <p className="font-medium mb-1">Catatan Membaca:</p>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {book.notes}
                </p>
              </div>
            )}

            {/* Tanggal beli */}
            {book.purchase_date && (
              <p className="text-sm text-gray-400">
                Dibeli pada{" "}
                {new Date(book.purchase_date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}

            {/* Info waktu dibuat */}
            <p className="text-sm text-gray-400 mt-2">
              Ditambahkan pada{" "}
              {new Date(book.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };

  const { data: book, error } = await supabase
    .from("books")
    .select("*") // ⚠️ pastikan Supabase sudah punya kolom price
    .eq("id", id)
    .single();

  if (error) console.error(error);

  return {
    props: { book: book ?? null },
  };
};
