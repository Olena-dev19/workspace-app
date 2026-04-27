"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import {
  updateUserProfile,
  updatePassword,
  deleteAccount,
} from "@/actions/user";

import css from "./SettingsForm.module.css";
import { EyeOff } from "@/public/EyeOff";
import { Eye } from "@/public/Eye";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function SettingsForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleProfileSave = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    startTransition(async () => {
      try {
        await updateUserProfile(formData);
        toast.success("Profile updated");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handlePasswordSave = () => {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);

    startTransition(async () => {
      try {
        await updatePassword(formData);
        toast.success("Password updated");

        setCurrentPassword("");
        setNewPassword("");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handleDeleteAccount = () => {
    const confirmDelete = confirm(
      "Are you sure? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        await deleteAccount();
        toast.success("Account deleted");

        window.location.href = "/";
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  return (
    <div className={css.wrapper}>
      <section className={css.section}>
        <h2 className={css.subTitle}>Profile</h2>
        <label className={css.label}>
          Name
          <input
            className={css.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </label>
        <label className={css.label}>
          Email
          <input
            className={css.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>

        <button
          className={css.button}
          onClick={handleProfileSave}
          disabled={isPending}
        >
          Save profile
        </button>
      </section>

      <section className={css.section}>
        <h2 className={css.subTitle}>Password</h2>
        <label className={css.label}>
          Password
          <input
            type="password"
            className={css.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />
        </label>
        <label className={css.label}>
          New Password
          <input
            type={showNewPassword ? "text" : "password"}
            className={css.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
          <button
            className={css.showBtn}
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            aria-label={
              showNewPassword
                ? "Hide current password"
                : "Show current password"
            }
          >
            {showNewPassword ? <Eye /> : <EyeOff />}
          </button>
        </label>

        <button
          className={css.button}
          onClick={handlePasswordSave}
          disabled={isPending}
        >
          Update password
        </button>
      </section>

      <section className={css.danger}>
        <h2>Danger zone</h2>

        <button onClick={handleDeleteAccount} disabled={isPending}>
          Delete account
        </button>
      </section>
    </div>
  );
}
