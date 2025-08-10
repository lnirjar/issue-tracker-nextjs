import { ProjectDetails } from "@/components/project-details";
import { TaskViewSwitcher } from "@/components/task-view-switcher";
import { dbConnect } from "@/lib/db";

export default async function ProjectPage() {
  await dbConnect();

  return (
    <div>
      <ProjectDetails />
      <TaskViewSwitcher />
    </div>
  );
}
