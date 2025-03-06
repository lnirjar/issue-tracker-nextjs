export const APP_NAME = "Issue Tracker";

// CLERK EVENTS
export const CLERK_USER_CREATED = "user.created";
export const CLERK_USER_UPDATED = "user.updated";
export const CLERK_USER_DELETED = "user.deleted";

// ROLES
export const ADMIN = "admin";
export const MEMBER = "member";

export type Role = typeof ADMIN | typeof MEMBER;

// MESSAGES
export const AUTH_REQUIRED_MESSAGE = "You are not logged in.";
export const UNKNOWN_ERROR_MESSAGE = "Something went wrong.";

export const CREATE_WORKSPACE_LOADING_MESSAGE = "Creating Workspace...";
export const CREATE_WORKSPACE_SUCCESS_MESSAGE =
  "Your workspace has been created.";
export const CREATE_WORKSPACE_ERROR_MESSAGE =
  "Failed to create your workspace.";
