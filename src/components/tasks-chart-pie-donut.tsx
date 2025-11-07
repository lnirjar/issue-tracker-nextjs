"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { useTasksDataQuery } from "@/hooks/queries/useTasksDataQuery";

import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  BACKLOG,
  DONE,
  IN_PROGRESS,
  IN_REVIEW,
  TaskStatus,
  TODO,
  UNKNOWN_ERROR_MESSAGE,
} from "@/lib/constants";

export const description = "A donut chart with text";

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  chrome: {
    label: snakeCaseToTitleCase(TODO),
    color: "#f87171",
  },
  safari: {
    label: snakeCaseToTitleCase(IN_PROGRESS),
    color: "#facc15",
  },
  firefox: {
    label: snakeCaseToTitleCase(IN_REVIEW),
    color: "#60a5fa",
  },
  edge: {
    label: snakeCaseToTitleCase(DONE),
    color: "#34d399",
  },
  other: {
    label: snakeCaseToTitleCase(BACKLOG),
    color: "#f472b6",
  },
} satisfies ChartConfig;

export function TasksChartPieDonutText() {
  const { data, isLoading, isPending, isError } = useTasksDataQuery({});

  if (isPending || isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }
  const totalTasks = data.tasks.length;

  const taskStatusCount: Record<TaskStatus, number> = {
    [TODO]: data.tasks.filter((task) => task.status === TODO).length,
    [IN_PROGRESS]: data.tasks.filter((task) => task.status === IN_PROGRESS)
      .length,
    [IN_REVIEW]: data.tasks.filter((task) => task.status === IN_REVIEW).length,
    [DONE]: data.tasks.filter((task) => task.status === DONE).length,
    [BACKLOG]: data.tasks.filter((task) => task.status === BACKLOG).length,
  };

  const chartData = [
    {
      status: snakeCaseToTitleCase(TODO),
      tasks: taskStatusCount[TODO],
      fill: "#f87171",
    },
    {
      status: snakeCaseToTitleCase(IN_PROGRESS),
      tasks: taskStatusCount[IN_PROGRESS],
      fill: "#facc15",
    },
    {
      status: snakeCaseToTitleCase(IN_REVIEW),
      tasks: taskStatusCount[IN_REVIEW],
      fill: "#60a5fa",
    },
    {
      status: snakeCaseToTitleCase(DONE),
      tasks: taskStatusCount[DONE],
      fill: "#34d399",
    },
    {
      status: snakeCaseToTitleCase(BACKLOG),
      tasks: taskStatusCount[BACKLOG],
      fill: "#f472b6",
    },
  ];

  return (
    <Card className="flex flex-col w-full md:w-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle>Task Status Overview</CardTitle>
        <CardDescription>
          Distribution of tasks based on their current status.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="tasks"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total tasks for this workspace
        </div>
      </CardFooter>
    </Card>
  );
}
