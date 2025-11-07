// Ensures all Mongoose models are registered before use.
// Import this once before using any model to avoid registration errors.

import "server-only";

import "@/models/user";
import "@/models/workspace";
import "@/models/workspace-invitation";
import "@/models/workspace-member";
import "@/models/project";
import "@/models/task";
