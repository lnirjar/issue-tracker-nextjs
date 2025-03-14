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

export const UPDATE_WORKSPACE_LOADING_MESSAGE = "Updating Workspace...";
export const UPDATE_WORKSPACE_SUCCESS_MESSAGE =
  "Your workspace has been updated.";
export const UPDATE_WORKSPACE_ERROR_MESSAGE = "Failed to upate your workspace.";

export const DELETE_WORKSPACE_LOADING_MESSAGE = "Deleting Workspace...";
export const DELETE_WORKSPACE_SUCCESS_MESSAGE =
  "Your workspace has been deleted.";
export const DELETE_WORKSPACE_ERROR_MESSAGE =
  "Failed to delete your workspace.";

export const WORKSPACE_ID_REQUIRED_MESSAGE = "Workspace id is required";
export const INVALID_WORKSPACE_ID_MESSAGE = "Workspace id is invalid";
export const NOT_WORKSPACE_MEMBER_MESSAGE =
  "You are not member of this workspace";
export const NOT_WORKSPACE_ADMIN_MESSAGE =
  "You are not admin of this workspace";
export const WORKSPACE_NOT_FOUND_MESSAGE =
  "This workspace does not exist or you are not a member";
