"use client";

import { useEffect, useState } from "react";

export default function AuthNav() {
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    const loadUsername = () => {
      const u = localStorage.getItem("username");
      setUsername(u);
    };

    loadUsername(); // Initial load

    // Listen for localStorage changes (works across tabs and same tab when using dispatchEvent)
    window.addEventListener("storage", loadUsername);

    return () => {
      window.removeEventListener("storage", loadUsername);
    };
  }, []);

  // useEffect(() => {
  //   const u = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
  //   setUsername(u);
  // }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  }

  if (!username) {
    return (
      <div className="flex items-center gap-6">
        <a href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
          <span>🔐</span>
          Login
        </a>
        <a href="/auth/signup" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
          <span>📝</span>
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-gray-700">Hi, <span className="font-semibold">{username}</span></div>
      <button onClick={logout} className="text-gray-600 hover:text-gray-900 transition-colors">Logout</button>
    </div>
  );
}


