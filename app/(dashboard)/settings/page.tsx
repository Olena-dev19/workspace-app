import { getCurrentUser } from "@/lib/auth";
import css from "./Settings.module.css";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className={css.container}>
      <h1 className={css.title}>Settings</h1>

      <form className={css.form}>
        <label>
          Name
          <input className={css.input} defaultValue={user?.name} />
        </label>

        <label>
          Email
          <input className={css.input} defaultValue={user?.email} />
        </label>
        <label>
          Password
          <input className={css.input} placeholder="Enter new password..." />
        </label>

        <button className={css.button}>Save</button>
      </form>
    </div>
  );
}
