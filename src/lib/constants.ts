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

export const RESET_WORKSPACE_INVITATION_LOADING_MESSAGE =
  "Resetting Workspace Invite...";
export const RESET_WORKSPACE_INVITATION_SUCCESS_MESSAGE =
  "Your workspace invite has been resetted.";
export const RESET_WORKSPACE_INVITATION_ERROR_MESSAGE =
  "Failed to reset your workspace invite.";

export const JOIN_WORKSPACE_LOADING_MESSAGE = "Joining Workspace...";
export const JOIN_WORKSPACE_SUCCESS_MESSAGE = "Your have joined the workspace.";
export const JOIN_WORKSPACE_ERROR_MESSAGE = "Failed to join the workspace.";

export const DELETE_WORKSPACE_LOADING_MESSAGE = "Deleting Workspace...";
export const DELETE_WORKSPACE_SUCCESS_MESSAGE =
  "Your workspace has been deleted.";
export const DELETE_WORKSPACE_ERROR_MESSAGE =
  "Failed to delete your workspace.";

export const CHANGE_MEMBER_ROLE_LOADING_MESSAGE = "Updating Role...";
export const CHANGE_MEMBER_ROLE_SUCCESS_MESSAGE =
  "Member role has been updated.";
export const CHANGE_MEMBER_ROLE_ERROR_MESSAGE = "Failed to update member role.";

export const LEAVE_WORKSPACE_LOADING_MESSAGE = "Leaving Workspace...";
export const LEAVE_WORKSPACE_SUCCESS_MESSAGE = "You have left the workspace.";
export const LEAVE_WORKSPACE_ERROR_MESSAGE = "Failed to leave the workspace.";

export const REMOVE_WORKSPACE_MEMBER_LOADING_MESSAGE = "Removing Member...";
export const REMOVE_WORKSPACE_MEMBER_SUCCESS_MESSAGE =
  "Member has been removed from the workspace.";
export const REMOVE_WORKSPACE_MEMBER_ERROR_MESSAGE = "Failed to remove member.";

export const CREATE_PROJECT_LOADING_MESSAGE = "Creating Project...";
export const CREATE_PROJECT_SUCCESS_MESSAGE = "Your project has been created.";
export const CREATE_PROJECT_ERROR_MESSAGE = "Failed to create your project.";

export const UPDATE_PROJECT_LOADING_MESSAGE = "Updating Project...";
export const UPDATE_PROJECT_SUCCESS_MESSAGE = "Your project has been updated.";
export const UPDATE_PROJECT_ERROR_MESSAGE = "Failed to update your project.";

export const DELETE_PROJECT_LOADING_MESSAGE = "Deleting Project...";
export const DELETE_PROJECT_SUCCESS_MESSAGE = "Your project has been deleted.";
export const DELETE_PROJECT_ERROR_MESSAGE = "Failed to delete your project.";

export const WORKSPACE_ID_REQUIRED_MESSAGE = "Workspace id is required";
export const INVALID_WORKSPACE_ID_MESSAGE = "Workspace id is invalid";
export const NOT_WORKSPACE_MEMBER_MESSAGE =
  "You are not member of this workspace";
export const NOT_WORKSPACE_ADMIN_MESSAGE =
  "You are not admin of this workspace";
export const WORKSPACE_NOT_FOUND_MESSAGE =
  "This workspace does not exist or you are not a member";

export const PROJECT_NOT_FOUND_MESSAGE = "Project not found";
