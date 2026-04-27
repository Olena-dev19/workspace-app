"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import css from "./SignIn.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye } from "@/public/Eye";
import { EyeOff } from "@/public/EyeOff";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspace";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error || "Sign in failed");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
    } catch (err) {
      toast.error((err as Error)?.message || "Sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <div className={css.card}>
        <h1 className={css.title}>Sign In</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              className={css.input}
              placeholder="Email"
              type="email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                className={css.input}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
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
          <button className={css.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className={css.footer}>
            Still need an account?{" "}
            <Link className={css.link} href="/sign-up">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
