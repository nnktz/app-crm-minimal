import { useList, useUpdate } from '@refinedev/core';
import { GetFieldsFromList } from '@refinedev/nestjs-query';
import { useMemo } from 'react';
import { DragEndEvent } from '@dnd-kit/core';

import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries';
import { TaskStage } from '@/graphql/schema.types';
import { TasksQuery } from '@/graphql/types';
import { UPDATE_TASK_STAGE_MUTATION } from '@/graphql/mutations';

import {
  KanbanBoard,
  KanbanBoardContainer,
} from '@/components/tasks/kanban/board';
import { ProjectCardMemo } from '@/components/tasks/kanban/card';
import KanbanColumn from '@/components/tasks/kanban/column';
import KanbanItem from '@/components/tasks/kanban/item';
import { KanbanAddCardButton } from '@/components/tasks/kanban/add-card-button';
import { KanbanColumnSkeleton, ProjectCardSkeleton } from '@/components';

export const TaskList = ({ children }: React.PropsWithChildren) => {
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: 'taskStages',
    filters: [
      {
        field: 'title',
        operator: 'in',
        value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'],
      },
    ],
    sorters: [
      {
        field: 'createdAt',
        order: 'asc',
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: 'tasks',
    sorters: [
      {
        field: 'dueDate',
        order: 'asc',
      },
    ],
    queryOptions: {
      enabled: !!stages,
    },
    pagination: {
      mode: 'off',
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });

  const { mutate: updateTask } = useUpdate();

  const taskStages = useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unasignedStage: [],
        stages: [],
      };
    }

    const unasignedStage = tasks.data.filter((task) => task.stageId === null);

    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }));

    return {
      unasignedStage,
      columns: grouped,
    };
  }, [stages, tasks]);

  const handleAddCard = (args: { stageId: string }) => {};

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current?.stageId;

    if (taskStageId === stageId) {
      return;
    }

    if (stageId === 'unasigned') {
      stageId = null;
    }

    updateTask({
      resource: 'tasks',
      id: taskId,
      values: {
        stageId,
      },
      successNotification: false,
      mutationMode: 'optimistic',
      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION,
      },
    });
  };

  const isLoading = isLoadingStages || isLoadingTasks;

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id='unasigned'
            title='unasigned'
            count={taskStages.unasignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: 'unasigned' })}>
            {taskStages.unasignedStage.map((task) => (
              <KanbanItem
                key={task.id}
                id={task.id}
                data={{ ...task, stageId: 'unasigned' }}>
                <ProjectCardMemo
                  {...task}
                  dueDate={task.dueDate || undefined}
                />
              </KanbanItem>
            ))}

            {!taskStages.unasignedStage.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: 'unasigned' })}
              />
            )}
          </KanbanColumn>

          {taskStages.columns?.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
              onAddClick={() => handleAddCard({ stageId: column.id })}>
              {!isLoading &&
                column.tasks.map((task) => (
                  <KanbanItem
                    key={task.id}
                    id={task.id}
                    data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}

              {!column.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>

      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanColumnSkeleton key={index}>
          {Array.from({ length: itemCount }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};