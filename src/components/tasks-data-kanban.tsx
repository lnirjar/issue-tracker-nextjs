import { useCallback, useEffect, useState } from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";

import { KanbanColumnHeader } from "@/components/tasks-kanban-column-header";
import { TaskKanbanCard } from "@/components/task-kanban-card";

import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";
import { useUpdateTaskMutation } from "@/hooks/mutations/useUpdateTaskMutation";

import {
  BACKLOG,
  DONE,
  IN_PROGRESS,
  IN_REVIEW,
  TASK_STATUSES,
  TaskStatus,
  TODO,
  UPDATE_TASK_ERROR_MESSAGE,
  UPDATE_TASK_SUCCESS_MESSAGE,
} from "@/lib/constants";

interface DataKanbanProps {
  data: GetTasksResponse;
}

type TasksState = {
  [key in TaskStatus]: GetTasksResponse["tasks"];
};

const getInitialTasksState = (data: GetTasksResponse) => {
  const initialTasks: TasksState = {
    [BACKLOG]: [],
    [TODO]: [],
    [IN_PROGRESS]: [],
    [IN_REVIEW]: [],
    [DONE]: [],
  };

  data.tasks.forEach((task) => {
    initialTasks[task.status].push(task);
  });

  Object.keys(initialTasks).forEach((status) => {
    initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
  });

  return initialTasks;
};

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(getInitialTasksState(data));

  useEffect(() => {
    setTasks(getInitialTasksState(data));
  }, [data]);

  const mutation = useUpdateTaskMutation();

  const onDragEnd = useCallback(
    (dropResult: DropResult) => {
      const { source, destination } = dropResult;

      if (!destination) return;

      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      if (
        sourceStatus === destinationStatus &&
        source.index === destination.index
      ) {
        return;
      }

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        if (!movedTask) {
          console.error("No task found at source index");
          return prevTasks;
        }

        const updatedMovedTask = { ...movedTask, status: destinationStatus };

        newTasks[sourceStatus] = sourceColumn;

        const destinationColumn = [...newTasks[destinationStatus]];
        destinationColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destinationStatus] = destinationColumn;

        let newPosition: number;

        if (destinationColumn.length === 1) {
          newPosition = 1000;
        } else if (destination.index === 0) {
          newPosition = destinationColumn[1].position / 2;
        } else if (destination.index === destinationColumn.length - 1) {
          newPosition =
            destinationColumn[destination.index - 1].position + 1000;
        } else {
          const prev = destinationColumn[destination.index - 1].position;
          const next = destinationColumn[destination.index + 1].position;
          newPosition = (prev + next) / 2;
        }

        const updatePayload: {
          _id: string;
          status: TaskStatus;
          position: number;
        } = {
          _id: updatedMovedTask._id.toString(),
          status: updatedMovedTask.status,
          position: Math.min(newPosition, 1_000_000),
        };

        mutation.mutate(updatePayload, {
          onSuccess: () => {
            toast.success(UPDATE_TASK_SUCCESS_MESSAGE);
          },
          onError: (error) => {
            console.error(error);
            toast.error(UPDATE_TASK_ERROR_MESSAGE);
          },
        });

        return newTasks;
      });
    },
    [mutation]
  );

  const boards = TASK_STATUSES;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-x-2 overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 bg-muted p-1.5 rounded-md min-w-48"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-52 py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task._id.toString()}
                        draggableId={task._id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskKanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
