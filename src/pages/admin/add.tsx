import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { useDarkMode } from "@/context/DarkModeContext";

export default function AddBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("wishlist");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState<number | null>(null); // ➕ Harga
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("books").insert([
      {
        title,
        author,
        description,
        status,
        start_date: startDate || null,
        finish_date: finishDate || null,
        purchase_date: purchaseDate || null,
        price, // ➕ Harga dikirim ke Supabase
        current_page: currentPage,
        total_pages: totalPages,
        rating,
        notes,
        cover_url: coverUrl || null,
      },
    ]);

    if (error) {
      alert("Gagal menambah buku: " + error.message);
    } else {
      alert("📖 Buku berhasil ditambahkan!");
      router.push("/admin");
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen p-8 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-6">➕ Tambah Buku Baru</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Judul */}
            <input
              type="text"
              placeholder="Judul Buku"
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Penulis */}
            <input
              type="text"
              placeholder="Penulis"
              className={`w-full border rounded px-3 py-2 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
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
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
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
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="wishlist">Ingin Dibaca</option>
              <option value="reading">Sedang Dibaca</option>
              <option value="completed">Selesai Dibaca</option>
            </select>

            {/* Tanggal Mulai */}
            <div>
              <label className="block mb-1">Tanggal Mulai</label>
              <input
                type="date"
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="block mb-1">Tanggal Selesai</label>
              <input
                type="date"
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
              />
            </div>

            {/* Tanggal Beli */}
            <div>
              <label className="block mb-1">Tanggal Beli</label>
              <input
                type="date"
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            {/* Harga Buku */}
            <div>
              <label className="block mb-1">Harga Buku (Rp)</label>
              <input
                type="number"
                placeholder="Contoh: 85000"
                min="0"
                value={price ?? ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Progress Membaca */}
            <div>
              <label className="block mb-1">Progress Membaca</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Halaman saat ini"
                  min="0"
                  value={currentPage ?? ""}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className={`border rounded px-3 py-2 w-1/2 ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />

                <input
                  type="number"
                  placeholder="Total halaman"
                  min="1"
                  value={totalPages ?? ""}
                  onChange={(e) => setTotalPages(Number(e.target.value))}
                  className={`border rounded px-3 py-2 w-1/2 ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
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
                value={rating ?? ""}
                onChange={(e) => setRating(Number(e.target.value))}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Catatan */}
            <div>
              <label className="block mb-1">Catatan Membaca</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* URL Cover */}
            <div>
              <label className="block mb-1 font-medium">URL Cover Buku</label>
              <input
                type="url"
                placeholder="https://contoh.com/cover.jpg"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="Preview Cover"
                  className="mt-3 w-32 h-auto rounded shadow"
                />
              )}
            </div>

            {/* Tombol Simpan */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-semibold transition ${
                isDarkMode
                  ? "bg-blue-700 hover:bg-blue-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Buku"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
