import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function ReadingProgress() {
  const router = useRouter();
  const { bookId } = router.query;
  const [progress, setProgress] = useState({ current_page: 0, total_pages: 0 });

  async function loadProgress() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return router.push('/login');
    const { data } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('book_id', bookId)
      .eq('user_id', user.user.id)
      .single();

    if (data) setProgress({ current_page: data.current_page, total_pages: data.total_pages });
  }

  async function saveProgress() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return router.push('/login');

    await supabase.from('reading_progress').upsert({
      user_id: user.user.id,
      book_id: bookId,
      current_page: progress.current_page,
      total_pages: progress.total_pages,
    });

    alert('Progress tersimpan!');
  }

  useEffect(() => {
    if (bookId) loadProgress();
  }, [bookId]);

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">📖 Progress Membaca</h1>

      <label className="block mb-1">Halaman Saat Ini</label>
      <input
        type="number"
        value={progress.current_page}
        onChange={(e) => setProgress({ ...progress, current_page: Number(e.target.value) })}
        className="border px-3 py-2 rounded w-full mb-3"
      />

      <label className="block mb-1">Total Halaman</label>
      <input
        type="number"
        value={progress.total_pages}
        onChange={(e) => setProgress({ ...progress, total_pages: Number(e.target.value) })}
        className="border px-3 py-2 rounded w-full mb-3"
      />

      <button
        onClick={saveProgress}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Simpan
      </button>
    </main>
  );
}
