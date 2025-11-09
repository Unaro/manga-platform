import type { Database } from "@/shared/database/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export type Permission = 
  | "catalog:read"
  | "catalog:write"
  | "catalog:delete"
  | "catalog:import"
  | "users:read"
  | "users:write"
  | "users:delete"
  | "sources:read"
  | "sources:write"
  | "sources:delete";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    "catalog:read"
  ],
  moderator: [
    "catalog:read",
    "catalog:write",
    "catalog:import",
    "sources:read"
  ],
  admin: [
    "catalog:read",
    "catalog:write",
    "catalog:delete",
    "catalog:import",
    "sources:read",
    "sources:write",
    "sources:delete",
    "users:read",
    "users:write",
    "users:delete"
  ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}
