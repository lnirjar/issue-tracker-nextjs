import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Constants
export const UPLOAD_PRESETS = {
  ISSUE_TRACKER_NEXTJS_WORKSPACE_AVATARS:
    "issue-tracker-nextjs-workspace-avatars",
  ISSUE_TRACKER_NEXTJS_IMAGES: "issue-tracker-nextjs-images",
};

export const WORKSPACE_AVATARS_FOLDER =
  "issue-tracker-nextjs/workspace-avatars";
export const IMAGES_FOLDER = "issue-tracker-nextjs/images";

const uploadToCloudinary = async (
  buffer: Buffer<ArrayBufferLike>,
  options: { public_id?: string; upload_preset: string }
): Promise<UploadApiResponse> => {
  try {
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(options, (error, uploadResult) => {
            if (error) {
              return reject(error);
            }

            if (!uploadResult) {
              return reject();
            }

            return resolve(uploadResult);
          })
          .end(buffer);
      }
    );

    return uploadResult;
  } catch (error) {
    const message =
      error instanceof Error
        ? `Something went wrong while uploading to Cloudinary: ${error.message}`
        : "Something went wrong while uploading to Cloudinary.";

    throw new Error(message);
  }
};

export const uploadWorkspaceAvatarToCloudinary = async (
  buffer: Buffer<ArrayBufferLike>,
  workspaceId: string
) => {
  const avatarPublicId = `workspace-avatar-${workspaceId}`;
  const uploadPreset = UPLOAD_PRESETS.ISSUE_TRACKER_NEXTJS_WORKSPACE_AVATARS;
  const uploadResult = await uploadToCloudinary(buffer, {
    public_id: avatarPublicId,
    upload_preset: uploadPreset,
  });

  return uploadResult;
};

export const deleteWorkspaceAvatarFromCloudinary = async (
  workspaceId: string
) => {
  const workspaceAvatarPublicId = `${WORKSPACE_AVATARS_FOLDER}/workspace-avatar-${workspaceId}`;
  try {
    await cloudinary.uploader.destroy(workspaceAvatarPublicId, {
      invalidate: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Something went wrong while deleting workspace avatar from Cloudinary \n` +
          `public_id: ${workspaceAvatarPublicId} \n` +
          `${error.message}`
        : "Something went wrong while deleting workspace avatar from Cloudinary.";

    console.error(new Error(message));
  }
};
