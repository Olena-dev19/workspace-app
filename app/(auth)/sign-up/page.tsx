import { registerUser } from "@/actions/auth";
import css from "./SignUp.module.css";

export default function SignUp() {
  return (
    <div className={css.container}>
      <div className={css.card}>
        <form action={registerUser}>
          <h1 className={css.title}>Sign Up</h1>
          <label className={css.label}>
            Email:
            <input
              className={css.input}
              placeholder="Email"
              type="email"
              name="email"
              required
            />
          </label>
          <label className={css.label}>
            Password:
            <input
              className={css.input}
              placeholder="Password"
              type="password"
              name="password"
              required
            />
          </label>
          <label className={css.label}>
            Name:
            <input
              className={css.input}
              placeholder="Name"
              type="text"
              name="name"
              required
            />
          </label>

          <button className={css.button} type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
