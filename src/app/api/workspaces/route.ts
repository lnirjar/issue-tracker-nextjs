import { Workspace } from "@/models/workspace";
import { createWorkspaceFormSchema } from "@/schemas/workspace";
import { getCurrentUser } from "@/lib/user";
import { uploadWorkspaceAvatarToCloudinary } from "@/lib/cloudinary";
import { AUTH_REQUIRED_MESSAGE, UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const formData = await request.formData();

    const data = {
      name: formData.get("name"),
      image: formData.get("image") || undefined,
    };

    const parsed = createWorkspaceFormSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, image } = parsed.data;

    const workspace = await Workspace.create({ name, user: user._id });

    if (!image) {
      return Response.json({ workspace }, { status: 201 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadWorkspaceAvatarToCloudinary(
      buffer,
      workspace._id.toString()
    );

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspace._id,
      {
        image: uploadResult.secure_url,
      },
      { new: true }
    );

    return Response.json({ workspace: updatedWorkspace }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: UNKNOWN_ERROR_MESSAGE }, { status: 500 });
  }
}
