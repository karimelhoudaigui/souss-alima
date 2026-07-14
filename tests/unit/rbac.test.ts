import { describe, expect, it } from "vitest";
import { canAccess, canManageRole, canMutateSession } from "../../src/lib/rbac";

describe("role permissions", () => {
  it("allows admins and teachers into back-office roles", () => {
    expect(canAccess("ADMIN", ["ADMIN", "TEACHER"])).toBe(true);
    expect(canAccess("TEACHER", ["ADMIN", "TEACHER"])).toBe(true);
    expect(canAccess("STUDENT", ["ADMIN", "TEACHER"])).toBe(false);
  });

  it("limits role management to admins", () => {
    expect(canManageRole("ADMIN", "TEACHER")).toBe(true);
    expect(canManageRole("TEACHER", "STUDENT")).toBe(false);
  });

  it("lets students mutate only their own sessions", () => {
    expect(canMutateSession("STUDENT", "u1", "u1")).toBe(true);
    expect(canMutateSession("STUDENT", "u1", "u2")).toBe(false);
    expect(canMutateSession("TEACHER", "t1", "u2")).toBe(true);
  });
});
