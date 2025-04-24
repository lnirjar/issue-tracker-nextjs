import { ProjectDetails } from "@/components/project-details";
import { dbConnect } from "@/lib/db";

export default async function ProjectPage() {
  await dbConnect();

  return (
    <div>
      <ProjectDetails />
    </div>
  );
}
