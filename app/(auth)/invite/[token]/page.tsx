import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?callbackUrl=/invite/${token}`);
  }

  redirect(`/invite/${token}/accept`);
}
