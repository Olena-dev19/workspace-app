import WorkspaceSettingsForm from "@/components/Workspace-settings/WorkspaceSettingsForm";
import { getWorkspaceById } from "@/lib/workspace";

interface Props {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function Settings({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) throw new Error("Workspace don't find");

  return <WorkspaceSettingsForm workspace={workspace} />;
}
