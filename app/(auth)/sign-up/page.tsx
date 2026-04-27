"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import css from "./SignUp.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Eye } from "@/public/Eye";
import { EyeOff } from "@/public/EyeOff";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Registration failed");
      }

      const signin = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (signin?.error) {
        toast.error(signin.error);
        setLoading(false);
        return;
      }
      router.push("/workspace");
    } catch (err) {
      setError((err as Error)?.message || "Failed to register");
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <div className={css.card}>
        <form onSubmit={handleSubmit}>
          <h1 className={css.title}>Sign Up</h1>
          {error && (
            <div style={{ color: "#c00", marginBottom: 12 }}>{error}</div>
          )}
          <label className={css.label}>
            Email:
            <input
              className={css.input}
              placeholder="Email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className={css.label}>
            Password:
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                className={css.input}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ marginLeft: 8, background: "none", border: "none" }}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </label>
          <label className={css.label}>
            Name:
            <input
              className={css.input}
              placeholder="Name"
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <button className={css.button} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
