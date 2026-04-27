// lib/mappers/workspace.mapper.ts

import { Types } from "mongoose";
import { WorkspaceDB, WorkspaceMemberDB } from "@/types/db/workspace";
import { WorkspaceDTO } from "@/types/dto/workspace.dto";

function isPopulatedUser(user: WorkspaceMemberDB["userId"]): user is {
  _id: Types.ObjectId;
  name: string;
  email: string;
} {
  return !(user instanceof Types.ObjectId);
}

export function mapWorkspace(workspace: WorkspaceDB): WorkspaceDTO {
  return {
    id: workspace._id.toString(),
    name: workspace.name,
    description: workspace.description,
    ownerId: workspace.ownerId.toString(),
    members: workspace.members.map((member) => {
      const user = member.userId;

      return {
        user: {
          id: isPopulatedUser(user) ? user?._id.toString() : user.toString(),
          name: isPopulatedUser(user) ? user?.name : "",
          email: isPopulatedUser(user) ? user?.email : "",
        },
        role: member.role,
      };
    }),
  };
}
