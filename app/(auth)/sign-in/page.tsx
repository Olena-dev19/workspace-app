"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import css from "./SignIn.module.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/w",
    });
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
            <input
              className={css.input}
              placeholder="Password"
              type="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className={css.button} type="submit">
            Sign In
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
