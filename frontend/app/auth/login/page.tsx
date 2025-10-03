"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
      const res = await fetch(`${base}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username || username);
      router.push("/");
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Login</h1>
      {error && <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded">{error}</div>}
      <div className="space-y-4">
        <input className="input w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="input w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button disabled={!username || !password || loading} onClick={submit} className="btn-primary w-full">
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="text-sm text-gray-600">No account? <a href="/auth/signup" className="text-blue-600">Sign up</a></div>
    </div>
  );
}


