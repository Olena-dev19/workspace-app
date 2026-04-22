// "use client";

// import { createInvite } from "@/actions/invite";
// import { useState } from "react";
// import css from "./InviteButton.module.css";

// export default function InviteButton({ workspaceId }: any) {
//   const [link, setLink] = useState("");

//   const handleCreate = async () => {
//     const res = await createInvite(workspaceId);
//     setLink(res.link);
//   };

//   const copy = async () => {
//     await navigator.clipboard.writeText(link);
//     alert("Copied!");
//   };

//   return (
//     <div className={css.container}>
//       <button onClick={handleCreate} className={css.button}>
//         Invite
//       </button>

//       {link && (
//         <div className={css.linkBox}>
//           <input value={link} readOnly />
//           <button onClick={copy}>Copy</button>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function InviteButton({ workspaceId }: any) {
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/invite`, {
        method: "POST",
        body: JSON.stringify({ workspaceId }),
      });

      const data = await res.json();

      await navigator.clipboard.writeText(data.link);

      toast.success("Link copied 🔗");
    } catch {
      toast.error("Failed to copy link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleInvite} disabled={loading}>
      +
    </button>
  );
}
