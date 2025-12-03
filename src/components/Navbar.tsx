import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false); // 📱 menu mobile
  const { isDarkMode, toggleTheme } = useDarkMode();

  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

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
    router.push("/");
  }

  return (
    <nav
      className={`px-6 py-3 shadow-md transition-colors duration-300 flex items-center justify-between ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* LOGO */}
      <Link href="/" className="font-bold text-lg hover:text-blue-500">
        📚 MyBooks
      </Link>

      {/* MENU DESKTOP */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/"
          className={`hover:text-blue-500 ${
            router.pathname === "/" ? "text-blue-500" : ""
          }`}
        >
          Daftar Buku
        </Link>

        {user && (
          <>
            <Link
              href="/admin"
              className={`hover:text-blue-500 ${
                router.pathname === "/admin" ? "text-blue-500" : ""
              }`}
            >
              Dashboard
            </Link>
          </>
        )}
      </div>

      {/* TOMBOL KANAN (DESKTOP) */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {!user ? (
          <Link
            href="/login"
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Logout
          </button>
        )}
      </div>

      {/* BUTTON MOBILE */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* MENU MOBILE DROPDOWN */}
      {open && (
        <div
          className={`absolute top-16 left-0 w-full px-6 py-4 flex flex-col gap-3 shadow-md md:hidden ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
          }`}
        >
          <Link
            href="/"
            className="py-2 hover:text-blue-400"
            onClick={() => setOpen(false)}
          >
            Daftar Buku
          </Link>

          {user && (
            <>
              <Link
                href="/admin"
                className="py-2 hover:text-blue-400"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </>
          )}

          {/* DARK MODE */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 py-2"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? "Mode Terang" : "Mode Gelap"}
          </button>

          {/* LOGIN / LOGOUT */}
          {!user ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={`px-4 py-2 text-center rounded ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
