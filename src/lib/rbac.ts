import { Role } from "@prisma/client";

export function canAccess(userRole: Role, allowed: Role[]) {
  return allowed.includes(userRole);
}

export function canManageRole(actorRole: Role, targetRole: Role) {
  if (actorRole !== "ADMIN") return false;
  return ["ADMIN", "TEACHER", "STUDENT"].includes(targetRole);
}

export function canMutateSession(actorRole: Role, ownerId: string, studentId: string) {
  return actorRole === "ADMIN" || actorRole === "TEACHER" || ownerId === studentId;
}
