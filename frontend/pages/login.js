import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("admin@digitalbrains.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#123a2e] to-[#1a5f6b] px-4">
      <div className="mb-8">
        <Logo variant="vertical" size="lg" />
      </div>

      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome 👋</h1>
        <p className="text-gray-400 text-sm mb-6">Please login here</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="robertallen@example.com"
            />
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="input-field pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold text-white">Employee</h2>
        <h2 className="text-3xl font-bold">
          <span className="text-brandGreen">Management</span>{" "}
          <span className="text-brandBlue">System</span>
        </h2>
      </div>
    </div>
  );
}
