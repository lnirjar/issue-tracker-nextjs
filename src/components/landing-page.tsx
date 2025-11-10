import Link from "next/link";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LandingPageNavbar } from "@/components/landing-page-navbar";
import { DemoLoginButton } from "@/components/demo-login-button";
import { Section } from "@/components/landing/section";
import { CodeBlock } from "@/components/landing/code-block";
import { List } from "@/components/landing/list";
import { LinkItem } from "@/components/landing/link-item";
import { FeatureCard } from "@/components/landing/feature-card";
import { Footer } from "@/components/landing/footer";

const features: { title: string; description: string; imageUrl: string }[] = [
  {
    title: "Dashboard",
    imageUrl: "/screenshots/01-dashboard.png",
    description:
      "Dashboard for the current workspace featuring workspace analytics, an invite link for new members, and a visual task-by-status pie chart.",
  },
  {
    title: "Workspace Switcher",
    imageUrl: "/screenshots/02-workspace-switcher.png",
    description:
      "Easily switch between different workspaces with a modern dropdown interface. Each workspace holds its own projects, tasks, and team members.",
  },
  {
    title: "Tasks - Table View",
    imageUrl: "/screenshots/03-tasks-table.png",
    description:
      "A spreadsheet-like table interface for managing and sorting tasks with filters, status indicators, and quick inline actions.",
  },
  {
    title: "Tasks - Kanban View",
    imageUrl: "/screenshots/04-tasks-kanban.png",
    description:
      "A drag-and-drop Kanban board that allows users to visualize task progress across columns such as Todo, In Progress, and Done.",
  },
  {
    title: "Tasks - Calendar View",
    imageUrl: "/screenshots/05-tasks-calendar.png",
    description:
      "A calendar-based task layout that helps visualize due dates, deadlines, and ongoing projects throughout the month.",
  },
  {
    title: "Task Details",
    imageUrl: "/screenshots/06-task-details.png",
    description:
      "Detailed task view showing assignee, project, due date, and description where you can edit task information and its description.",
  },
  {
    title: "Project View",
    imageUrl: "/screenshots/07-project-tasks-table.png",
    description:
      "Each project includes its own task list and metrics. Users can track progress and manage tasks at a project level for better focus.",
  },
  {
    title: "Filter Tasks",
    imageUrl: "/screenshots/08-project-tasks-table-filter.png",
    description:
      "Advanced task filtering by status, assignee, or due date. Enables users to quickly locate specific tasks within large datasets.",
  },
  {
    title: "Workspace Members",
    imageUrl: "/screenshots/09-workspace-members.png",
    description:
      "Displays all members in a workspace with their roles and permissions. Admins can manage access or invite new collaborators.",
  },
  {
    title: "Workspace Settings",
    imageUrl: "/screenshots/10-workspace-settings.png",
    description:
      "Settings page where you can edit workspace, reset the invitation link, or permanently delete the workspace.",
  },
];

export const LandingPage = () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-12 py-12 flex flex-col">
      <LandingPageNavbar />
      <main className="flex flex-col gap-6 max-w-2xl my-12">
        <h1 className="text-6xl font-bold">Issue Tracker</h1>
        <p>
          This is a full-stack{" "}
          <strong>issue tracking and project management</strong> application
          inspired by Jira. Built with{" "}
          <strong>
            Next.js 15, React, MongoDB, React Query, Clerk, Cloudinary, Shadcn
            UI
          </strong>
          , and <strong>TypeScript</strong>.
        </p>
        <p>
          This app allows teams to collaborate seamlessly using Workspaces,
          Projects, Tasks, Role-based Access, and multiple task views like
          Kanban, Table, and Calendar.
        </p>

        <div className="flex items-center gap-3">
          <Button className="w-fit" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <span className="text-xs text-muted-foreground">or</span>
          <DemoLoginButton variant="outline" />
        </div>
      </main>
      <Section title="🚀 Live Demo">
        <div className="flex flex-col gap-4">
          <ul className="space-y-2">
            <LinkItem
              label="Live URL"
              url="https://issue-tracker-react-nextjs.vercel.app"
              icon="🌐"
            />
            <LinkItem
              label="GitHub Repo"
              url="https://github.com/lnirjar/issue-tracker-nextjs"
              icon="💻"
            />
          </ul>
          <section className="flex flex-col gap-1 max-w-sm mt-2">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <UserIcon /> Demo User
            </h3>
            <CodeBlock
              code={`Username: demo
Password: a#b#c#123`}
            />
          </section>
        </div>
      </Section>

      <Section title="🛠️ Tech Stack">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Frontend & Framework</h3>
            <List
              items={[
                "Next.js 15",
                "React 19",
                "Server + Client Components",
                "React Query",
                "React Hook Form",
                "Tailwind CSS",
                "Shadcn UI",
                "TypeScript",
              ]}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Backend & Database</h3>
            <List items={["MongoDB", "Mongoose", "Zod"]} />

            <h3 className="font-semibold text-lg mt-4 mb-2">
              Authentication & Storage
            </h3>
            <List items={["Clerk", "Cloudinary"]} />

            <h3 className="font-semibold text-lg mt-4 mb-2">Utilities</h3>
            <List
              items={[
                "Axios",
                "date-fns",
                "React Big Calendar",
                "React Icons",
                "Lucide Icons",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="✨ Features">
        <div className="mt-6 flex flex-wrap gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </Section>
      <Footer />
    </div>
  );
};
