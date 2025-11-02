import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { isDarkMode, toggleTheme } = useDarkMode();

  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  }

  return (
    <nav
      className={`px-6 py-3 flex justify-between items-center shadow-md transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg hover:text-blue-500">
          📚 MyBooks
        </Link>
        <Link
          href="/"
          className={`hover:text-blue-500 ${router.pathname === '/' ? 'text-blue-500' : ''}`}
        >
          Daftar Buku
        </Link>

        {user && (
          <>
            <Link
              href="/admin"
              className={`hover:text-blue-500 ${
                router.pathname === '/admin' ? 'text-blue-500' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/add"
              className={`hover:text-blue-500 ${
                router.pathname.startsWith('/admin/add') ? 'text-blue-500' : ''
              }`}
            >
              Tambah Buku
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* 🌙 Tombol Dark Mode */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {!user ? (
          <Link
            href="/login"
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
