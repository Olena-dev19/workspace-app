import { getCurrentUser } from "@/lib/auth";

import css from "./Settings.module.css";
import SettingsForm from "@/components/Settings/SettingsForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className={css.container}>
      <h1 className={css.title}>Settings</h1>

      <SettingsForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
        }}
      />
    </div>
  );
}
